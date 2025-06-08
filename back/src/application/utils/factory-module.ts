import { ClassRegistry } from "../../core/enum/class-registry";
import { DIContainer } from "../../shared/di.container";


export function factoryModule(module: ClassRegistry) {
  return DIContainer.resolve(module);
}
