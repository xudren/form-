function setRem() {
  const baseSize = 16; // 32
  const scale = document.documentElement.clientWidth / 414; // 750
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + "px";
  console.log(
    document.documentElement.style.fontSize,
    "document.documentElement.style.fontSize"
  );
}
setRem();
window.onresize = function() {
  setRem();
};
