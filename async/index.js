function waitForSequence(arr, sequence, done, prevData = null) {
  const first = arr[0] || null

  if(!first) {
    return done()
  }

  first((error, data) => {
    if(error) throw error
    prevData = data
    sequence(error, data)
    arr.shift()
    waitForSequence(arr, sequence, done, prevData)
  }, prevData)
}

function sequence(arr) {
  let data

  function getSequence(error, value) {
    if(error) throw error
    data = value
  }

  return function(callback){
    waitForSequence(arr, getSequence, function(){
      callback(null, data)
    })
  }
}

function parallel(arr) {
  let data = []

  function getSequence(error, value) {
    if(error) throw error
    data.push(value)
  }

  return function(callback) {
    waitForSequence(arr, getSequence, function(){
      callback(null, data)
    })
  }
}

function race(arr) {
  let error
  let isFirstCompleted = false

  return function(callback) {
    function executeElement(error, data) {
      if(error) throw error
      if(!isFirstCompleted) {
        isFirstCompleted = true
        callback(null, data)
      }
    }
    arr.forEach(el => el(executeElement))
  }
}

module.exports = {
  sequence,
  parallel,
  race,
}
