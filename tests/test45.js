
function testWith(x) {
  with(x) {
    console.log(foo.bar);
  }
}

testWith({foo: {bar: 100}});

