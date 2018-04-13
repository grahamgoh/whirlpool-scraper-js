function zip(a, b) {
  return a.map(function(e, i) {
    return [e, b[i]];
  });
}

function flatten(list) {
  return list.map(i => {
    const i1 = i[0];
    const i2 = i[1];
    return { ...i1, ...i2 };
  });
}

module.exports = { zip, flatten };
