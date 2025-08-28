import AstroBox from "astrobox-plugin-sdk";
let activationData = "";
let ui;

// 注册功能ID
let ICSendId = AstroBox.native.regNativeFun(ICSend);
let InputChangeId = AstroBox.native.regNativeFun(onInputChange);

AstroBox.lifecycle.onLoad(() => {
  ui = [
    {
      node_id: "activationInput",
      visibility: true,
      disabled: false,
      content: {
        type: "Input",
        value: {
          text: "",
          placeholder: "粘贴设备ID:激活码:Base64签名",
          callback_fun_id: InputChangeId,
        }
      }
    },
    {
      node_id: "send",
      visibility: true,
      disabled: false,
      content: {
        type: "Button",
        value: { primary: true, text: "发送激活数据", callback_fun_id: ICSendId },
      },
    },
    {
      node_id: "status",
      visibility: true,
      disabled: false,
      content: {
        type: "Text",
        value: "请粘贴激活数据并点击发送",
      },
    },
    {
      node_id: "tip",
      visibility: true,
      disabled: false,
      content: {
        type: "Text",
        value: "格式: 设备ID:六位激活码:Base64签名",
      },
    }
  ];

  AstroBox.ui.updatePluginSettingsUI(ui);
});

function onInputChange(params) {
  if (params && params.trim() !== "") {
    activationData = params.trim();
    updateStatus("数据已输入，点击发送");
  } else {
    activationData = "";
    updateStatus("请粘贴激活数据");
  }
}

async function ICSend() {
  if (!activationData || activationData.trim() === "") {
    updateStatus("请先输入激活数据");
    return;
  }

  const parts = activationData.split(':');
  if (parts.length !== 3) {
    updateStatus("数据格式错误，应为 设备ID:激活码:签名");
    return;
  }

  try {
    const appList = await AstroBox.thirdpartyapp.getThirdPartyAppList();
    const app = appList.find(app => app.package_name === "com.waijade.verify");
    
    if (!app) {
      updateStatus("请确保设备已连接且应用已安装");
      return;
    }

    await AstroBox.interconnect.sendQAICMessage(
      "com.waijade.verify",
      activationData
    );
    
    updateStatus("激活数据发送成功");
  } catch (error) {
    console.error("发送错误详情:", error);
    updateStatus(`发送失败: ${error.message || '未知错误'}`);
  }
}

function updateStatus(message) {
  ui[2].content.value = message;
  AstroBox.ui.updatePluginSettingsUI(ui);
}