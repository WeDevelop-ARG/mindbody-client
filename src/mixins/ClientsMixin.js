import { defaults } from 'lodash'

import Client from '../classes/Client'

const DEFAULT_PARAMS = {}

const ClientsMixin = ParentClass =>
  class Clients extends ParentClass {
    constructor (params) {
      super(params)
      this._params = defaults(params, DEFAULT_PARAMS)
    }

    getAllClients ({ searchText }) {
      return this.get('/client/clients', {
        params: {
          SearchText: searchText
        },
        responseMapper: ({ Clients }) =>
          Clients.map(client => new Client(this, client))
      })
    }
  }

export default ClientsMixin
