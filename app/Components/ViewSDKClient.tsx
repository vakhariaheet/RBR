// @ts-ignore 
class ViewSDKClient {
    readyPromise: Promise<unknown>;
    adobeDCView: undefined;
    constructor() {
        this.readyPromise = new Promise<void>((resolve) => {
        //@ts-ignore
        if (window.AdobeDC) {
          resolve();
        } else {
          document.addEventListener("adobe_dc_view_sdk.ready", () => {
            resolve();
          });
        }
      });
      this.adobeDCView = undefined;
    }
    ready() {
      return this.readyPromise;
    }
    previewFile(divId:string, viewerConfig:any, url:string) {
      const config = {
          clientId: process.env.NEXT_PUBLIC_ABODE_ID, ///enter lient id here
            divId,
      };
    //   @ts-ignore
      this.adobeDCView = new window.AdobeDC.View(config); //   @ts-ignore
      const previewFilePromise = this.adobeDCView.previewFile(
        {
          content: {
            location: {
              url: url,
            },
          },
          metaData: {
            fileName: "Menu.pdf",
            id: "6d07d124-ac85-43b3-a867-36930f502ac6",
          },
        },
        viewerConfig
      );
      return previewFilePromise;
    }
    previewFileUsingFilePromise(divId: any, filePromise: any, fileName: any) {
        // @ts-ignore
      this.adobeDCView = new window.AdobeDC.View({
        clientId: "d9709e4cb4904804821371858a45db08", //enter Client id here
        divId,
      });
        // @ts-ignore
      this.adobeDCView.previewFile(
        {
          content: {
            promise: filePromise,
          },
          metaData: {
            fileName: fileName,
          },
        },
        {}
      );
    }
    registerSaveApiHandler() {
      const saveApiHandler = (metaData:any, content:any, options:any) => {
        console.log(metaData, content, options);
        return new Promise((resolve) => {
          setTimeout(() => {
            const response = {
                // @ts-ignore
              code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              data: {
                metaData: Object.assign(metaData, {
                  updatedAt: new Date().getTime(),
                }),
              },
            };
            resolve(response);
          }, 2000);
        });
      };
        // @ts-ignore
        this.adobeDCView.registerCallback(
        //@ts-ignore
        window.AdobeDC.View.Enum.CallbackType.SAVE_API,
        saveApiHandler,
        {}
      );
    }
    registerEventsHandler() {
        // @ts-ignore
        this.adobeDCView.registerCallback(
        //@ts-ignore
            window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            //@ts-ignore
        (event) => {
          console.log(event);
        },
        {
          enablePDFAnalytics: true,
        }
      );
    }
  }
  export default ViewSDKClient;