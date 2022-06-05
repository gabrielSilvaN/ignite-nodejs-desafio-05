import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("user")
      .where("user.title ILIKE :title", { title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) as count from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "users")
      .where("game.id = :id", { id })
      .getOneOrFail();

    return result.users;
  }
}
