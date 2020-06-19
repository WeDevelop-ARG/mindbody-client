class ClientMembership {
  constructor (mbClient, membership) {
    this._mbClient = mbClient
    this._membership = membership
  }

  get id () {
    return this._membership.MembershipId
  }

  get iconCode () {
    return this._membership.IconCode
  }
}

export default ClientMembership
