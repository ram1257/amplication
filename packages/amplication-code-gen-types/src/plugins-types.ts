import type { Promisable } from "type-fest";
import {
  clientDirectories,
  DTOs,
  Module,
  serverDirectories,
} from "./code-gen-types";
import { DSGResourceData } from "./dsg-resource-data";
import { Events } from "./plugin-events";

export interface BuildLogger {
  /**
   * Log an info message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @returns
   */
  info: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ) => Promise<void>;
  /**
   * Log a warning message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @returns
   */
  warn: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ) => Promise<void>;
  /**
   * Log an error message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @param error Error
   * @returns
   */
  error: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string,
    error?: Error
  ) => Promise<void>;
}

export interface EventParams {}

export type PluginBeforeEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T
) => Promisable<T>;

export type PluginAfterEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T,
  modules: Module[]
) => Promisable<Module[]>;

export interface PluginEventType<T extends EventParams> {
  before?: PluginBeforeEvent<T>;
  after?: PluginAfterEvent<T>;
}

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  skipDefaultBehavior: boolean;
  abortGeneration: (msg: string) => void;
  abortMessage?: string;
  abort: boolean;
  importStaticModules: (source: string, basePath: string) => Promise<Module[]>;
}

export interface DsgContext extends DSGResourceData {
  /**
   * List of generated files.
   */
  modules: Module[];
  DTOs: DTOs;
  plugins: PluginMap;
  /**
   * Logger for user facing logs. Logs will be visible in the build log.
   */
  logger: BuildLogger;
  utils: ContextUtil;
  clientDirectories: clientDirectories;
  serverDirectories: serverDirectories;
  userEntityName: string;
  userNameFieldName: string;
  userPasswordFieldName: string;
  userRolesFieldName: string;
}

export type PluginWrapper = (args: EventParams, func: () => void) => any;

export type PluginMap = {
  [K in EventNames]?: {
    before?: PluginBeforeEvent<EventParams>[];
    after?: PluginAfterEvent<EventParams>[];
  };
};

export enum EventNames {
  CreateEntityController = "CreateEntityController",
  CreateEntityControllerBase = "CreateEntityControllerBase",
  CreateEntityControllerSpec = "CreateEntityControllerSpec",
  CreateServerAuth = "CreateServerAuth",
  CreateAdminUI = "CreateAdminUI",
  CreateServer = "CreateServer",
  CreateServerAppModule = "CreateServerAppModule",
  CreateServerDotEnv = "CreateServerDotEnv",
  CreateServerGitIgnore = "CreateServerGitIgnore",
  CreateAdminGitIgnore = "CreateAdminGitIgnore",
  CreateMessageBroker = "CreateMessageBroker",
  CreateMessageBrokerTopicsEnum = "CreateMessageBrokerTopicsEnum",
  CreateMessageBrokerNestJSModule = "CreateMessageBrokerNestJSModule",
  CreateMessageBrokerClientOptionsFactory = "CreateMessageBrokerClientOptionsFactory",
  CreateMessageBrokerService = "CreateMessageBrokerService",
  CreateMessageBrokerServiceBase = "CreateMessageBrokerServiceBase",
  CreateEntityService = "CreateEntityService",
  CreateEntityServiceBase = "CreateEntityServiceBase",
  CreateServerDockerCompose = "CreateServerDockerCompose",
  CreateServerDockerComposeDB = "CreateServerDockerComposeDB",
  CreatePrismaSchema = "CreatePrismaSchema",
  CreateServerPackageJson = "CreateServerPackageJson",
  CreateAdminUIPackageJson = "CreateAdminUIPackageJson",
  CreateEntityModule = "CreateEntityModule",
  CreateEntityModuleBase = "CreateEntityModuleBase",
  CreateEntityResolver = "CreateEntityResolver",
  CreateEntityResolverBase = "CreateEntityResolverBase",
  CreateSwagger = "CreateSwagger",
  CreateSeed = "CreateSeed",
  CreateEntityControllerToManyRelationMethods = "CreateEntityControllerToManyRelationMethods",
  CreateEntityResolverToManyRelationMethods = "CreateEntityResolverToManyRelationMethods",
  CreateEntityResolverToOneRelationMethods = "CreateEntityResolverToOneRelationMethods",
  CreateDTOs = "CreateDTOs",
  LoadStaticFiles = "LoadStaticFiles",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
