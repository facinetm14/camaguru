import { SESSION_ID_KEY } from "./consts.js";
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

export const setGlobalState = async () => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    return;
  }

  const userInfosResp = await userService.getMe(sessionId);
  if (userInfosResp.ok) {
    const userInfosRespData = await userInfosResp.json();
    userStore.setState({ user: userInfosRespData });
  }

  const user = userStore.getState().user;
  const getImagesResult = await userService.getAllImages();
  if (getImagesResult.ok) {
    const allImages = [...(await getImagesResult.json())];
    const myImageList = allImages.filter((image) => image.userId === user.id);
    const otherImageList = allImages.filter(
      (image) => image.userId !== user.id
    );

    userStore.setState({ myImageList, otherImageList });
  }
};

export default userStore;
