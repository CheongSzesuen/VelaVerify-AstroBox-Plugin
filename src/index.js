import AstroBox from "astrobox-plugin-sdk";
let activationData = "";
let packageName = "";
let ui;

// 注册功能ID
let ICSendId = AstroBox.native.regNativeFun(ICSend);
let InputChangeId = AstroBox.native.regNativeFun(onInputChange);
let PackageInputChangeId = AstroBox.native.regNativeFun(onPackageInputChange);

AstroBox.lifecycle.onLoad(() => {
  // 读取保存的包名配置
  const config = AstroBox.config.readConfig();
  packageName = config.lastPackageName || "";
  
  ui = [
    {
      node_id: "packageInput",
      visibility: true,
      disabled: false,
      content: {
        type: "Input",
        value: {
          text: packageName,
          placeholder: "要验证的快应用包名",
          callback_fun_id: PackageInputChangeId,
        }
      }
    },
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
    },
    {
      node_id: "tip",
      visibility: true,
      disabled: false,
      content: {
        type: "Text",
        value: "包名请前往快应用管理查看应用名下方的一行字",
      },
    },
    {
      node_id: "tip",
      visibility: true,
      disabled: false,
      content: {
        type: "Text",
        value: "格式如com.waijade.velaverify",
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

function onPackageInputChange(params) {
  if (params && params.trim() !== "") {
    packageName = params.trim();
  } else {
    packageName = "";
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

  if (!packageName || packageName.trim() === "") {
    updateStatus("请先输入目标应用包名");
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
    
    // 发送成功后保存包名到配置
    AstroBox.config.writeConfig({
      lastPackageName: packageName
    });
    
    updateStatus("激活数据发送成功");
  } catch (error) {
    console.error("发送错误详情:", error);
    updateStatus(`发送失败: ${error.message || '未知错误'}`);
  }
}

function updateStatus(message) {
  ui[3].content.value = message;
  AstroBox.ui.updatePluginSettingsUI(ui);
}