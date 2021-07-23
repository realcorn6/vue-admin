/**
 * 过滤特殊字符
 */
export function stripscript(str) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（ ）——|{}【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

/**
 * 过滤邮箱
 */
export function validateEmail(value) {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  return regEmail.test(value);
}

/**
 * 验证密码，6至20位的字母+数字
 */
export function validatePass(value) {
  const regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return regPassword.test(value);
}

/**
 * 验证验证码，6位的字母+数字
 */
export function validateVCode(value) {
  const regCode = /^[a-z0-9]{6}$/;
  return regCode.test(value);
}
