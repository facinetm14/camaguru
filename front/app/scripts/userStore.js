import { userService } from "../usecases/userService.js";

class UserStore {
  constructor() {
    this.state = {
      user: {},
      myImageList: [],
      otherImageList: [],
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
  const userInfosResp = await userService.getMe(sessionId);
  if (userInfosResp.ok) {
    const userInfosRespData = await userInfosResp.json();
    userStore.setState({ user: userInfosRespData });

    const getImagesResult = await userService.getMyImages();
    if (getImagesResult.ok) {
      const imageList = [...(await getImagesResult.json())];
      const myImageList = imageList.filter(
        (img) => img.author.id === userInfosRespData.id
      );

      const otherImageList = imageList.filter(
        (img) => img.author.id !== userInfosRespData.id
      );
      userStore.setState({ myImageList, otherImageList });
    }
  }
}

export default userStore;
