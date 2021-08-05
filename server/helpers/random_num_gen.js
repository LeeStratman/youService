const randomNumGenerator = (length) => {
  let randomNum = "";

  for (let i = 0; i < length; i++) {
    const currentNum = Math.floor(Math.random() * 10);
    randomNum += currentNum;
  }
  return randomNum;
};

module.exports = randomNumGenerator;
