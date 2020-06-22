import ClientMembership from './ClientMembership'

class Client {
  constructor (mbClient, clientData) {
    this._mbClient = mbClient
    this._clientData = clientData
  }

  get id () {
    return this._clientData.Id
  }

  get isActive () {
    return this._clientData.Active
  }

  get email () {
    return this._clientData.Email
  }

  getActiveMemberships () {
    return this._mbClient.get('/client/activeclientmemberships', {
      params: {
        ClientId: this.id
      },
      responseMapper: ({ ClientMemberships }) =>
        ClientMemberships.map(m => new ClientMembership(this._mbClient, m))
    })
  }
}

export default Client
