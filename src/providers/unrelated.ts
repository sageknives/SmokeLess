// process.env.NODE_ENV = "test";

// // mocha
// import "mocha";
// import { suite, test, timeout } from "mocha-typescript";




// //require chai and use should assertions
// let chai: Chai.ChaiStatic = require("chai");
// chai.should();

// //configure chai-http
// chai.use(require("chai-http"));

// let expect = chai.expect;

// @suite.only("Testing algorithm")
// class AmountTest {


//   /**
//    * Before all hook.
//    */
//   public static before() {

//     return;
//   }

//   public after() {
//     return;
//   };
//   /**
//    * After all hook
//    */
//   public static after() {
//     return;
//   }

//   public handleError(error: any) {
//     if (error && error.response && error.response.error) throw new Error(error.response.error.status + ", " + error.response.error.text);
//     else if (error && error.message) throw new Error(error.message);
//     else throw new Error(JSON.stringify(error));
//   }



//   @test("should create an array")
//   public decayRateTest72() {
//     let mg = 1;
//     let decayRate = 72;
//     //what is now?
//     //let dayHours96 = this.getNumberHoursArray(1,96);
//     let dayHours96 = this.getNumberHoursArray2();
//     let today = new Array<number>();
//     for (let i = decayRate; i < dayHours96.length; i++) {
//       let count = 0;
//       for (let j = 0; j < decayRate; j++) {
//         let hour = i - decayRate + j;
//         let hourMg = mg * dayHours96[hour];
//         let percentageCounted = hour / decayRate;
//         let hourMgCounted = hourMg * percentageCounted;
//         count = count + hourMgCounted;
//         console.log(
//           "HOUR:" + hour +
//           ", hour mg:" + hourMg +
//           ", percentageCounted:" + percentageCounted +
//           ", hourMgCounted:" + hourMgCounted +
//           ", count so far:" + count
//         )
//       }
//       today.push(count);
//     }
//     for (let i = 0; i < today.length; i++) {
//       let numberText = (i % 12 === 0) ? 12 : i % 12;
//       console.log(numberText + ": " + today[i])
//     }
//   }
//   @test("should create an array2")
//   public decayRateTestHalfLife2() {
//     let mg = 1.5;
//     let halfLife = 2;
//     let dayHours96 = this.getNumberHoursArray2();
//     let today = new Array<number>();
//     for (let now = 72; now < dayHours96.length; now++) {
//       let count = 0;
//       for (let past = now; past >= 0; past--) {
//         let hourMg = mg * dayHours96[past];
//         let n = (now - past) / halfLife;
//         let mgCounted = (hourMg / Math.pow(2, n));
//         if(mgCounted.toString().includes("e")) break;
//         count = count + mgCounted;
//         console.log(
//           "HOUR:" + past +
//           ", hour mg:" + hourMg +
//           ", hourMgCounted:" + mgCounted +
//           ", count so far:" + count
//         )
//       }
//       today.push(count);
//     }
//     for (let i = 0; i < today.length; i++) {
//       let numberText = (i % 12 === 0) ? 12 : i % 12;
//       console.log(numberText + ": " + today[i])
//     }
//   }

//   public getNumberHoursArray(num: number, count: number) {
//     let hours = new Array<number>();
//     for (let i = 0; i < count; i++) hours.push(num);
//     return hours;
//   }
//   public getNumberHoursArray2() {
//     // return [
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     // ]
//     // return [
//     //   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     // ]
//     // return [
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     //   0, 0, 0, 0, 0, 0, 0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0
//     // ]
//     return [
//       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//     ]
//   }
// }