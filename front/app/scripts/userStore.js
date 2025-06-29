import { userApi } from "../api/user.api.js";
import { GaleryPagination } from "./utils.js";

class UserStore {
  constructor() {
    this.state = {
      user: {},
      myImageList: [],
      otherImageList: [],
      myGaleryStart: 0,
      otherGaleryStart: 0,
    };
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}

const userStore = new UserStore();

export async function setGlobalState(sessionId) {
  if (!sessionId) {
    return null;
  }
  const userInfosResp = await userApi.getMe(sessionId);
  if (userInfosResp.ok) {
    const userInfosRespData = await userInfosResp.json();
    userStore.setState({ user: userInfosRespData });

    const getImagesResult = await userApi.getMyImages();
    if (getImagesResult.ok) {
      const imageList = [...(await getImagesResult.json())];
      const myImageList = imageList.filter(
        (img) => img.author.id === userInfosRespData.id
      );

      const otherImageList = imageList.filter(
        (img) => img.author.id !== userInfosRespData.id
      );
      const myGaleryStart =
        +localStorage.getItem(GaleryPagination.MY_GALERY_START) ?? 0;
      const otherGaleryStart =
        +localStorage.getItem(GaleryPagination.OTHER_GALERY_START) ?? 0;
      localStorage.removeItem(GaleryPagination.MY_GALERY_START);

      userStore.setState({
        myImageList,
        otherImageList,
        myGaleryStart,
        otherGaleryStart,
      });
    }
  }
}

export default userStore;
