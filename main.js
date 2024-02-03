"use strict";
function main(lines) { // lines: Array<string>
  /**
   * このコードは標準入力と標準出力を用いたサンプルコードです。
   * このコードは好きなように編集・削除してもらって構いません。
   *
   * This is a sample code to use stdin and stdout.
   * You can edit and even remove this code as you like.
  */

  const trimmedInput = input.trim().toLowerCase();

  switch (trimmedInput) {
    case "world":
      console.log("Hello World!");
      break;
    case "track":
      console.log("Hello Track!");
      break;
    default:
      console.log("Unknown input");
  }
  

   lines.forEach((v, i) => console.log(`lines[${i}]: ${v}`));
}

function runWithStdin() {
  let input = "";
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", v => {
    input += v;
  });
  process.stdin.on("end", () => {
    main(input);
  });
}
runWithStdin();