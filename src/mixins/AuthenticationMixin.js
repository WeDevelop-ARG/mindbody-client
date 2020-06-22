import { defaults } from 'lodash'

const DEFAULT_PARAMS = {
  tokenLifetimeAfterLastUseMS: 5 * 24 * 60 * 60 * 1000 // 5 days
}

const AuthenticationMixin = ParentClass =>
  class Authentication extends ParentClass {
    constructor (params) {
      super(params)
      this._params = defaults(params, DEFAULT_PARAMS)
      this._tokenLastUsedAtMS = null
    }

    async doRequest ({ url, ...requestConfig }) {
      if (urlRequiresAuthentication(url)) {
        await this._ensureTokenIsValid()

        this._tokenLastUsedAtMS = Date.now()
      }

      return super.doRequest({ url, ...requestConfig })
    }

    _ensureTokenIsValid () {
      if (this._isCurrentTokenExpired()) {
        return this._renewAccessToken()
      }
    }

    _isCurrentTokenExpired () {
      const timeElapsedSinceLastUseMS = Date.now() - this._tokenLastUsedAtMS

      return timeElapsedSinceLastUseMS >= this._params.tokenLifetimeAfterLastUseMS
    }

    async _renewAccessToken () {
      const tokenPagination = await this._getStaffUserToken({
        username: this._params.staffUsername,
        password: this._params.staffPassword
      })

      this.httpClient.defaults.headers.common.Authorization = tokenPagination.response
    }

    _getStaffUserToken ({ username, password }) {
      return this.post('/usertoken/issue', {
        Username: username,
        Password: password
      }, { responseMapper: ({ AccessToken }) => AccessToken })
    }
  }

function urlRequiresAuthentication (url) {
  return url !== '/usertoken/issue'
}

export default AuthenticationMixin
