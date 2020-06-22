import { defaults } from 'lodash'

const DEFAULT_PARAMS = {}

const SiteMixin = ParentClass =>
  class Site extends ParentClass {
    constructor (params) {
      super(params)
      this._params = defaults(params, DEFAULT_PARAMS)
    }

    getDeveloperActivationMethods () {
      return this.get('/site/activationcode', {
        responseMapper: ({ ActivationCode, ActivationLink }) => ({
          activationCode: ActivationCode,
          activationLink: ActivationLink
        })
      })
    }
  }

export default SiteMixin
