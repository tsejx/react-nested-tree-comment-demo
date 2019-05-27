export default function createHash(expect = 6) {
  var str = Math.random()
    .toString(36)
    .substring(2);

  while (str.length < expect) {
    str = Math.random()
      .toString(36)
      .substring(2);
  }

  return str.substring(0, expect);
}
