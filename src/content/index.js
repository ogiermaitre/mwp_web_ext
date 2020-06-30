import { map } from 'rambda'

console.log('hey from content script')
map(console.log, 'salut la foule'.split(' '))
