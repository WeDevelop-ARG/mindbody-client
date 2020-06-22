import { flow } from 'lodash'
import BaseClient from './classes/BaseClient'
import AuthenticationMixin from './mixins/AuthenticationMixin'
import ClientsMixin from './mixins/ClientsMixin'
import SiteMixin from './mixins/SiteMixin'

const applyMixins = flow(
  AuthenticationMixin,
  ClientsMixin,
  SiteMixin
)
const MindbodyClient = applyMixins(BaseClient)

export default MindbodyClient
