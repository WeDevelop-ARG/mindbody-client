import { defaults } from 'lodash'
import axios from 'axios'
import util from 'util'

import Pagination from './Pagination'

const DEFAULT_PARAMS = {
  baseURL: 'https://api.mindbodyonline.com/public/v6',
  contentType: 'application/json',
  requestTimeout: 0,
  enableTestMode: false,
  enableRequestLogging: false,
  requestLoggingDepth: 2,
  enableRequestLoggingInOneLine: true,
  paginationLimit: 100,
  maxContentLength: 4000000 // 4 MB
}

export default class BaseClient {
  constructor (params) {
    params = defaults(params, DEFAULT_PARAMS)
    this.httpClient = axios.create({
      baseURL: params.baseURL,
      headers: {
        'Api-Key': params.apiKey,
        SiteId: params.siteId,
        'Content-Type': params.contentType,
        Test: params.enableTestMode
      },
      params: {
        Limit: params.paginationLimit
      },
      timeout: params.requestTimeout,
      maxContentLength: params.maxContentLength
    })

    if (params.enableRequestLogging) {
      this._setupRequestLogging(params)
    }
  }

  _setupRequestLogging ({ requestLoggingDepth, enableRequestLoggingInOneLine }) {
    const inspectConfig = {
      compact: enableRequestLoggingInOneLine ? true : undefined,
      breakLength: enableRequestLoggingInOneLine ? Infinity : undefined,
      depth: requestLoggingDepth
    }

    this.httpClient.interceptors.request.use(function (config) {
      console.log('MINDBODY_CLIENT:REQUEST:', util.inspect(config, inspectConfig))

      return config
    })

    this.httpClient.interceptors.response.use(function (response) {
      console.log('MINDBODY_CLIENT:RESPONSE:', util.inspect(response, inspectConfig))

      return response
    })
  }

  async doRequest (config) {
    try {
      const response = await this.httpClient(config)

      return new Pagination(this, config, response.data)
    } catch (err) {
      this._handleError(err)
    }
  }

  _handleError (err) {
    if (err.response) this._handleAPIError(err)
    else throw err
  }

  _handleAPIError (err) {
    const { Error } = err.response.data

    err.code = Error.Code
    err.message = Error.Message

    throw err
  }

  get (url, config) {
    return this.doRequest({ url, method: 'GET', ...config })
  }

  post (url, data, config) {
    return this.doRequest({ url, data, method: 'POST', ...config })
  }
}
