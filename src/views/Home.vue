<template>
  <div class="container">
    <div class="top">
      <div>请<span>提前3个工作日</span>预约</div>
      <div>请留下您的联系方式</div>
    </div>
    <div class="form">
      <van-form @submit="onSubmit">
        <!-- 姓名-->
        <van-field
          v-model="username"
          placeholder="请输入姓名"
          label="姓名"
          :rules="[{ required: true }]"
          class="requiredContent"
        />
        <!-- 联系方式-->
        <van-field
          v-model="telNumber"
          placeholder="请输入联系方式"
          label="联系方式"
          :rules="[{ required: true }]"
          class="requiredContent"
        />
        <!-- 人数 -->
        <van-field
          v-model="count"
          placeholder="请输入人数"
          label="人数"
          :rules="[{ required: true }]"
          class="requiredContent"
        />
        <!-- 所属党支部/单位 -->
        <van-field
          v-model="unit"
          placeholder="请输入所属党支部/单位"
          label="所属党支部/单位"
          :rules="[{ required: true }]"
          class="requiredContent"
          @blur="reloadCanvas"
        />
        <!-- 上传单位Logo图片 -->
        <van-field
          name="uploader"
          label="文件上传"
          class="upload-logo"
          :rules="[{ required: ifShowRequired, message: '请上传Logo' }]"
          :class="{ requiredContent: ifShowRequired }"
        >
          <template #input>
            <van-uploader
              v-model="uploader"
              :after-read="afterRead"
              :max-count="1"
            />
          </template>
        </van-field>
        <!-- 活动主题 -->
        <van-field
          v-model="theme"
          placeholder="此主题内容自动生成会标,请完成填写"
          label="活动主题"
          :rules="[{ required: true }]"
          class="requiredContent"
          @blur="reloadCanvas"
          :maxlength="20"
          show-word-limit
        />
        <!-- 备注 -->
        <van-field v-model="remark" placeholder="请输入备注" label="备注" />
        <!-- 活动开始时间 -->
        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="startPicker"
          label="活动开始时间"
          placeholder="点击选择活动开始时间"
          @click="showStartPicker = true"
          :rules="[{ required: true }]"
          class="requiredContent"
        />
        <!-- 活动结束时间 -->
        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="endPicker"
          label="活动结束时间"
          placeholder="点击选择活动开始时间"
          @click="showEndPicker = true"
          :rules="[{ required: true }]"
          class="requiredContent"
        />
        <!-- 设备要求 -->
        <van-field name="radio" label="设备要求">
          <template #input>
            <van-checkbox-group v-model="result" direction="horizontal">
              <van-checkbox
                :name="item.name"
                v-for="item in arrayCheckbox"
                :key="item.id"
                >{{ item.name }}</van-checkbox
              >
            </van-checkbox-group>
          </template>
        </van-field>
        <!-- 是否显示预览 -->
        <van-field name="radio" label="会标">
          <template #input>
            <van-radio-group
              v-model="ifShow"
              direction="horizontal"
              @change="changePreview"
            >
              <van-radio name="1">自动生成</van-radio>
              <van-radio name="2">自行准备</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!--提示-->
        <!-- <van-notice-bar
          color="#1989fa"
          background="#ecf9ff"
          left-icon="info-o"
          v-if="ifShowRequired"
          >请点击选择背景图</van-notice-bar
        > -->
        <!--背景图片-->
        <!-- <van-swipe
          class="my-swipe"
          indicator-color="white"
          v-if="ifShowRequired"
        >
          <van-swipe-item
            v-for="item in arrUrl"
            :key="item.id"
            @click="selectChange(item)"
          >
            <van-image fit="cover" :src="item.item" />
          </van-swipe-item>
        </van-swipe> -->
        <!--通知栏-->
        <van-notice-bar
          color="#1989fa"
          background="#ecf9ff"
          v-if="ifShowRequired"
          left-icon="info-o"
          >请选择会标底板</van-notice-bar
        >
        <!--背景图-->
        <van-grid :border="false" :column-num="3" v-if="ifShowRequired">
          <van-grid-item v-for="item in arrUrl" :key="item.id">
            <div class="grid-list">
              <van-image fit="cover" :src="item.item" />
              <div class="grid-item">
                <van-button
                  size="mini"
                  type="info"
                  plain
                  hairline
                  @click="showPreview(item)"
                  >放大预览</van-button
                >
                <van-radio-group v-model="canvasBG">
                  <van-radio
                    style="z-index:99"
                    :name="item.id"
                    @click="selectChange(item)"
                  ></van-radio>
                </van-radio-group>
              </div>
            </div>
          </van-grid-item>
        </van-grid>
        <!--canvas-->
        <div name="display" id="display" v-if="ifShowRequired">
          <canvas id="canvas" style="z-index: 9999;"></canvas>
        </div>
        <!--通知栏-->
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o"
          >提交预约申请后,后台审核时间需要一个工作日</van-notice-bar
        >
        <!--提交-->
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
    <!-- 开始日期弹框 -->
    <van-popup v-model="showStartPicker" position="bottom">
      <van-datetime-picker
        type="date"
        @confirm="onStartConfirm"
        @cancel="showStartPicker = false"
        title="选择活动开始时间"
      />
    </van-popup>
    <!-- 结束日期弹框 -->
    <van-popup v-model="showEndPicker" position="bottom">
      <van-datetime-picker
        type="date"
        @confirm="onEndConfirm"
        @cancel="showEndPicker = false"
        title="选择活动结束时间"
      />
    </van-popup>
    <!--图片预览-->
    <van-image-preview v-model="ifShowPreview" closeable :images="images">
    </van-image-preview>
    <!---->
    <van-notify v-model="showNotice" type="warning">
      <van-icon name="bell" style="margin-right: 4px;" />
      <span
        >请确认您已经上传logo,填写了活动主题、活动开始时间/所属党支部/单位</span
      >
    </van-notify>
  </div>
</template>

<script>
// @ is an alias to /src
import { onMounted, reactive, ref } from "@vue/composition-api";

export default {
  name: "Home",
  setup() {
    const topSmallTitle = ref("新型冠状病毒"); //小标题
    const topLargeTitle = ref("疫情防控"); //大标题
    const username = ref(null); //姓名
    const telNumber = ref(null); //联系方式
    const count = ref(null); //人数
    const unit = ref("陆家嘴金融发展中心"); //所属党支部/单位
    const uploader = ref([
      {
        url:
          "http://wei.wiseljz.com//Uploads/Picture/2021-02-03/601a140c752d9.jpg"
      }
    ]); //上传
    const theme = ref("大棋局中如何精准落子"); //活动主题
    const remark = ref(null); //备注
    const showStartPicker = ref(false); //活动开始日期弹框
    const startPicker = ref("2011-01-01"); //活动开始日期
    const showEndPicker = ref(false); //活动结束日期弹框
    const endPicker = ref(null); //活动结束日期
    const result = reactive([]); //设备要求
    let canvasBG = ref("");
    let ifShowPreview = ref(false); //是否显示图片预览
    let images = reactive([
      // require("@/views/image/background6.jpg"),
      // require("@/views/image/background7.jpg"),
      // require("@/views/image/background8.jpg")
    ]); //图片预览的数组
    let showNotice = ref(false); //通知组件的显示与否
    let canvasDom;
    let canvasContext;
    onMounted(() => {});
    const arrayCheckbox = reactive([
      {
        id: 0,
        name: "led屏幕"
      },
      {
        id: 1,
        name: "投影"
      },
      {
        id: 2,
        name: "话筒"
      },
      {
        id: 3,
        name: "电脑"
      }
    ]);
    const ifShow = ref("2"); //是否显示预览
    const ifShowRequired = ref(false); //shangchuanlogo是否必填
    const arrUrl = reactive([
      { id: 0, item: require("@/views/image/background6.jpg") },
      {
        id: 1,
        item: require("@/views/image/background7.jpg")
      },
      { id: 2, item: require("@/views/image/background8.jpg") }
    ]);
    const onStartConfirm = date => {
      startPicker.value =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date
          .getDate()
          .toString()
          .padStart(2, "0");
      showStartPicker.value = false;
      if (ifShowRequired) {
        canvasBG.value = "";
        canvasContext.clearRect(
          0,
          0,
          canvasDom.clientWidth,
          canvasDom.clientHeight
        );
      }
    };
    const onEndConfirm = time => {
      console.dir(time, "endtime");
      endPicker.value = String(
        time.getFullYear() + "-" + time.getMonth() + 1 + "-" + time.getDate()
      );
      showEndPicker.value = false;
    };
    const onSubmit = () => {
      //提交按钮
    };
    const changePreview = name => {
      //是否显示预览 单选框
      if (name === "1") {
        ifShowRequired.value = true;
        showNotice.value = true;
        setTimeout(() => {
          showNotice.value = false;
        }, 3000);
      } else {
        ifShowRequired.value = false;
      }
      canvasBG.value = "";
    };
    const selectChange = item => {
      drawCanvas(item);
    };
    const drawCanvas = item => {
      console.log(uploader, "uploader");
      canvasDom = document.getElementById("canvas");
      if (canvasDom.getContext) {
        canvasContext = canvasDom.getContext("2d");
      }
      // let getPixelRatio = function(context) {
      //   let backingStore =
      //     context.backingStorePixelRatio ||
      //     context.webkitBackingStorePixelRatio ||
      //     context.mozBackingStorePixelRatio ||
      //     context.msBackingStorePixelRatio ||
      //     context.oBackingStorePixelRatio ||
      //     context.backingStorePixelRatio ||
      //     1;

      //   return (window.devicePixelRatio || 1) / backingStore;
      // };
      // let ratio = getPixelRatio(canvasContext);
      let image = new Image();
      image.src = item.item;
      image.width = canvasDom.clientWidth;
      image.height = canvasDom.clientHeight;
      canvasContext.drawImage(image, 0, 0, image.width, image.height);

      canvasContext.textAlign = "center";
      canvasContext.font = 'normal bold 20px "微软雅黑"';
      image.src = uploader.value[0].url;
      if (item.id === 0) {
        canvasContext.drawImage(image, 125, 0, 50, 50);
        canvasContext.fillText(theme.value, 150, 75, 150);
        canvasContext.font = 'normal  14px "微软雅黑"';
        canvasContext.fillText(unit.value, 150, 100, 100);
        canvasContext.fillText(startPicker.value, 150, 125, 70);
      } else {
        canvasContext.drawImage(image, 5, 5, 50, 50);
        canvasContext.fillText(theme.value, 90, 80, 150);
        canvasContext.font = 'normal  14px "微软雅黑"';
        canvasContext.fillText(startPicker.value, 90, 130, 70);
        canvasContext.fillText(unit.value, 90, 105, 100);
      }
    };
    const showPreview = item => {
      // showImage(imageUrl[id]);
      images[0] = item.item;
      // images[0] = imageUrl[id];
      ifShowPreview.value = true;
    };
    const reloadCanvas = () => {
      if (ifShowRequired) {
        canvasBG.value = "";
        canvasContext.clearRect(
          0,
          0,
          canvasDom.clientWidth,
          canvasDom.clientHeight
        );
      }
    };
    const afterRead = () => {
      //上传
      if (ifShowRequired) {
        canvasBG.value = "";
        canvasContext.clearRect(
          0,
          0,
          canvasDom.clientWidth,
          canvasDom.clientHeight
        );
        uploader.value[0].url = uploader.value[0]["file"]["name"];
      }
    };
    return {
      topSmallTitle,
      topLargeTitle,
      username,
      telNumber,
      count,
      unit,
      theme,
      remark,
      showStartPicker,
      startPicker,
      showEndPicker,
      endPicker,
      onStartConfirm,
      onEndConfirm,
      uploader,
      result,
      ifShow,
      arrUrl,
      ifShowRequired,
      changePreview,
      onSubmit,
      arrayCheckbox,
      selectChange,
      ifShowPreview,
      images,
      showPreview,
      canvasBG,
      showNotice,
      reloadCanvas,
      afterRead
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.top {
  padding: 4px;
  span {
    color: red;
  }
  background-color: #fff;
  height: 48px;
  width: 100%;
  box-sizing: border-box;
}
.top > div:nth-child(1) {
  padding-bottom: 4px;
}
.form {
  padding: 16px 0 0;
  height: calc(100% - 48px);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
}
::v-deep .requiredContent .van-field__label {
  position: relative;
}
::v-deep .requiredContent .van-field__label::before {
  position: absolute;
  content: "*";
  color: red;
  left: -8px;
  top: -8px;
}
// ::v-deep .van-swipe-item {
//   height: 160px;
// }
::v-deep .van-image {
  width: 100%;
  height: 100%;
}
#display {
  width: 100%;
  height: 176px;
}
#canvas {
  width: 100%;
  height: 100%;
}
::v-deep .van-checkbox-group--horizontal {
  justify-content: space-between;
}
::v-deep .van-checkbox {
  padding-top: 4px;
}
.grid-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.grid-item {
  display: flex;
  flex-direction: row;
  padding-top: 8px;
  justify-content: space-around;
  width: 100%;
}
canvas {
  letter-spacing: 4px;
}
::v-deep .van-uploader__preview-image {
  width: 128px;
  height: 128px;
}
</style>
