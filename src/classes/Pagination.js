class ResultsPage {
  constructor (mbClient, requestConfig, response) {
    this[Symbol.asyncIterator] = this.pagesGenerator
    this._mbClient = mbClient
    this._requestConfig = requestConfig
    this._response = response
    this._paginationResponse = response.PaginationResponse
  }

  get response () {
    if (typeof this._requestConfig.responseMapper === 'function') {
      return this._requestConfig.responseMapper(this._response)
    }

    return this._response
  }

  get pageSize () {
    return this._paginationResponse?.PageSize ?? 0
  }

  get totalResults () {
    return this._paginationResponse?.TotalResults ?? 0
  }

  get requestedOffset () {
    return this._paginationResponse?.RequestedOffset ?? 0
  }

  get requestedLimit () {
    return this._paginationResponse?.RequestedLimit ?? 0
  }

  get nextOffset () {
    return this.requestedOffset + this.pageSize
  }

  get previousOffset () {
    return this.requestedOffset - this.requestedLimit
  }

  isEmpty () {
    return this.pageSize === 0
  }

  async * pagesGenerator () {
    let current = this
    while (current && !current.isEmpty()) {
      yield current.response
      current = await current.getNextPage()
    }
  }

  hasNextPage () {
    return this.nextOffset < this.totalResults
  }

  hasPreviousPage () {
    return this.requestedOffset > 0
  }

  getNextPage () {
    if (!this.hasNextPage()) return null

    return this._mbClient.doRequest({
      ...this._requestConfig,
      params: {
        ...(this._requestConfig.params || {}),
        Offset: this.nextOffset
      }
    })
  }

  getPreviousPage () {
    if (!this.hasPreviousPage()) return null

    return this._mbClient.doRequest({
      ...this._requestConfig,
      params: {
        ...(this._requestConfig.params || {}),
        Offset: this.previousOffset
      }
    })
  }
}

export default ResultsPage
