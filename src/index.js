import AstroBox from "astrobox-plugin-sdk";

let activationData = "";
let ui;

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
          placeholder: "粘贴网站返回的一长串数据包",
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
        value: "数据格式为 设备ID:十二位激活码:Base64签名:包名",
      },
    },
    {
      node_id: "tip",
      visibility: true,
      disabled: false,
      content: {
        type: "Text",
        value: "例如：d4cd0dab...:DIK114514:RnsXBxiF...:cn.waijade.velaverify",
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
  if (parts.length < 4) {
    updateStatus("数据格式错误，应为 设备ID:激活码:签名:包名（共4部分）");
    return;
  }

  const packageName = parts[parts.length - 1];

  if (!packageName || packageName.trim() === "") {
    updateStatus("包名不能为空，请检查数据格式");
    return;
  }

  try {
    const appList = await AstroBox.thirdpartyapp.getThirdPartyAppList();
    const app = appList.find(app => app.package_name === packageName);
    
    if (!app) {
      updateStatus(`应用 ${packageName} 未找到，请确保设备已连接且应用已安装`);
      return;
    }

    await AstroBox.interconnect.sendQAICMessage(packageName, activationData);
    
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