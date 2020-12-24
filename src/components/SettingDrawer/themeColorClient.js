// eslint-disable-next-line eslint-comments/disable-enable-pair

/* eslint-disable import/no-extraneous-dependencies */
// import client from '../../../node_modules/webpack-theme-color-replacer/client';
// import generate from '../../../node_modules/@ant-design/colors/lib/generate';
// export default {
//   getAntdSerials(color) {
//     const lightCount = 9;
//     const divide = 10; // 淡化（即less的tint）
//     debugger
//     let lightens = new Array(lightCount).fill(0);
//     lightens = lightens.map((_, i) => client.varyColor.lighten(color, i / divide));
//     const colorPalettes = generate(color);
//     const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',');
//     return lightens.concat(colorPalettes).concat(rgb);
//   },

//   changeColor(color) {
//     if (!color) {
//       return Promise.resolve();
//     }
//     const options = {
//       // new colors array, one-to-one corresponde with `matchColors`
//       newColors: this.getAntdSerials(color),

//       changeUrl(cssUrl) {
//         // while router is not `hash` mode, it needs absolute path
//         return `/${cssUrl}`;
//       },
//     };
//     return client.changer.changeColor(options, Promise);
//   },
// };
