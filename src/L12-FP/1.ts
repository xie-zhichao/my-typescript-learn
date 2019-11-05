import * as _ from 'lodash/fp'

interface IMaybe<T> {
  of(x: T): IMaybe<T>;
}

const Maybe: IMaybe<string> = function(x:  ) {
  this._value = x
}

Maybe.of = function(x) {
  return new Maybe(x)
}

Maybe.prototype.isNothing = function() {
  return this._value === undefined || this._value === null;
}

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value))
}

const map = _.curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f)
})

const IO = function(f) {
  this._value = f
}

IO.of = function(x) {
  return new IO(function(){}
    return x
  })
}

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this._value))
}

let io_time = new IO(function() {
  return new Date()
})

let dateOfNow = io_time.map(function(time) {
  return time.getDate()
})

console.log(dateOfNow._value())

const url = new IO(function() {
  return 'http://pms.test0.i-fun.tech:3001/page/fund-management/energy-bills?id=108&id=12'
})

const toPairs = _.compose(_.map(_.split('=')), _.split('&'))

const params = _.compose(toPairs, _.last, _.split('?'))

const findParam = function(key) {
  return map(_.compose(Maybe.of, _.filter(_.compose(_.eq(key), _.head)), params), url)
}


console.log(findParam('id')._value())