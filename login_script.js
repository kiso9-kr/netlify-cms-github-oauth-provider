
const REQUIRED_ORIGIN_PATTERN = 
  /^((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,})(\,((\*|([\w_-]{2,}))\.)*(([\w_-]{2,})\.)+(\w{2,}))*$/

if (!(process.env.ORIGINS || "https://kiso9.kr").match(REQUIRED_ORIGIN_PATTERN)) {
  throw new Error('process.env.ORIGINS MUST be comma separated list \
    of origins that login can succeed on.')
}
const origins = process.env.ORIGINS.split(',')


module.exports = (oauthProvider, message, content) => `
<script>
(function() {
  function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].indexOf('*') >= 0) {
        const regex = new RegExp(arr[i].replaceAll('.', '\\\\.').replaceAll('*', '[\\\\w_-]+'))
        console.log(regex)
        if (elem.match(regex) !== null) {
          return true;
        }
      } else {
        if (arr[i] === elem) {
          return true;
        }
      }
    }
    return false;
  }
  function recieveMessage(e) {
    console.log("recieveMessage %o", e)
    if (!contains(${JSON.stringify(origins)}, e.origin.replace('https://', 'http://').replace('http://', ''))) {
      console.log('Invalid origin: %s', e.origin);
      return;
    }
    // send message to main window with da app
