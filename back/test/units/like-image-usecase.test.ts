import { LikeImageUseCase } from "../../src/application/usecases/users/like-image.usecase";
import { LikeImageError } from "../../src/core/error/like-image.error";
import { LikeImageRepository } from "../../src/infrastructure/repositories/like-image.repository";
import { UserImageRepository } from "../../src/infrastructure/repositories/user-image.repository";
import { UserRepositoryInMemory } from "../../src/infrastructure/repositories/user-repository-in-memory";
import { Ok } from "../../src/shared/result";

describe("Like image usecase", () => {
  let likeImageUseCase: LikeImageUseCase;
  let imageRepo: UserImageRepository;
  let likeImageRepo: LikeImageRepository;

  beforeAll(() => {
    imageRepo = {} as UserImageRepository;
    likeImageRepo = {} as LikeImageRepository;

    likeImageUseCase = new LikeImageUseCase(imageRepo, likeImageRepo);
  });

  it("should return  IMAGE_NOT_FOUND when image is not found", async () => {
    imageRepo.find = jest.fn().mockReturnValue(null);
    const likeImageResult = await likeImageUseCase.execute("1", "-1");

    expect(likeImageResult).toMatchObject({
      isErr: true,
      error: LikeImageError.IMAGE_NOT_FOUND,
    });
  });

  it("should create a like if no like found for the user", async () => {
    // Arrange
    imageRepo.find = jest.fn().mockReturnValue({
      id: "1",
      userId: "2",
      name: "profile_pic_jane_doe.jpg",
      createdAt: new Date("2025-01-12T09:30:00Z"),
      updatedAt: new Date("2025-06-22T14:45:00Z"),
    });

    likeImageRepo.findAllByIdMageAndAuthorId = jest.fn().mockReturnValue(null);
    likeImageRepo.create = jest.fn().mockReturnValue(
      Ok({
        id: "like-1",
        imageId: "1",
        authorId: "1",
        createdAt: new Date("2025-06-22T15:10:00Z"),
        updatedAt: new Date("2025-06-22T15:10:00Z"),
      })
    );

    //Act
    const likeImageResult = await likeImageUseCase.execute("1", "1");

    //Expect
    expect(likeImageResult).toMatchObject({
      isErr: false,
      data: { authorId: "1", imageId: "1" },
    });
  });

  it("should remove a like if it's already exists for the user for the same image", async () => {
    // Arrange
    imageRepo.find = jest.fn().mockReturnValue({
      id: "1",
      userId: "2", // should match a real/fake User.id
      name: "profile_pic_jane_doe.jpg",
      createdAt: new Date("2025-01-12T09:30:00Z"),
      updatedAt: new Date("2025-06-22T14:45:00Z"),
    });

    likeImageRepo.findAllByIdMageAndAuthorId = jest.fn().mockReturnValue({
      id: "like-1",
      imageId: "1",
      authorId: "1",
      createdAt: new Date("2025-06-22T15:10:00Z"),
      updatedAt: new Date("2025-06-22T15:10:00Z"),
    });
    likeImageRepo.delete = jest.fn().mockResolvedValue(undefined);

    //Act
    const likeImageResult = await likeImageUseCase.execute("1", "1");

    //Expect
    expect(likeImageResult).toMatchObject({
      isErr: false,
      data: null,
    });
  });
});
