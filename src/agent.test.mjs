// node src/agent.test.mjs
import assert from 'node:assert'
import { QA, answer } from './agent.js'

assert.equal(answer('Сколько стоит стрижка?'), null, 'empty KB answers nothing')

QA.push({ q: ['цена', 'стрижк'], a: 'от 30 €' })
assert.equal(answer('Какая ЦЕНА на стрижку?'), 'от 30 €', 'all keywords, any case')
assert.equal(answer('какая цена?'), null, 'partial keyword match must not fire')
QA.length = 0

console.log('ok')
