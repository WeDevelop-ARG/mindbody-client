import { flow } from 'lodash'
import BaseClient from './classes/BaseClient'
import AuthenticationMixin from './mixins/AuthenticationMixin'
import ClientsMixin from './mixins/ClientsMixin'

const applyMixins = flow(
  AuthenticationMixin,
  ClientsMixin
)
const MindbodyClient = applyMixins(BaseClient)

export default MindbodyClient
