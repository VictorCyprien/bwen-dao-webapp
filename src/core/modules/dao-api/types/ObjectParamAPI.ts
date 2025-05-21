import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { ChallengeRequest } from '../models/ChallengeRequest';
import { ChallengeResponse } from '../models/ChallengeResponse';
import { ConnectionResponse } from '../models/ConnectionResponse';
import { ConnectionsList } from '../models/ConnectionsList';
import { CreateDeviceRequest } from '../models/CreateDeviceRequest';
import { CreateDeviceResponse } from '../models/CreateDeviceResponse';
import { DAO } from '../models/DAO';
import { DAOApplication } from '../models/DAOApplication';
import { DAOApplicationAction } from '../models/DAOApplicationAction';
import { DAOApplicationList } from '../models/DAOApplicationList';
import { DAOApplicationResponse } from '../models/DAOApplicationResponse';
import { DAOInvitation } from '../models/DAOInvitation';
import { DAOInvitationAction } from '../models/DAOInvitationAction';
import { DAOInvitationList } from '../models/DAOInvitationList';
import { DAOInvitationResponse } from '../models/DAOInvitationResponse';
import { DAOMembership } from '../models/DAOMembership';
import { DAOMembershipResponse } from '../models/DAOMembershipResponse';
import { DAOModule } from '../models/DAOModule';
import { DAOModuleAccessResponse } from '../models/DAOModuleAccessResponse';
import { DAOModuleResponse } from '../models/DAOModuleResponse';
import { DAOModulesList } from '../models/DAOModulesList';
import { DAOSchemaResponse } from '../models/DAOSchemaResponse';
import { DAOUpdate } from '../models/DAOUpdate';
import { DeleteDeviceResponse } from '../models/DeleteDeviceResponse';
import { Device } from '../models/Device';
import { DeviceList } from '../models/DeviceList';
import { DeviceWithKey } from '../models/DeviceWithKey';
import { DisconnectResponse } from '../models/DisconnectResponse';
import { DiscordChannel } from '../models/DiscordChannel';
import { DiscordChannelResponse } from '../models/DiscordChannelResponse';
import { DiscordChannelsResponse } from '../models/DiscordChannelsResponse';
import { DiscordMessage } from '../models/DiscordMessage';
import { DiscordMessagesResponse } from '../models/DiscordMessagesResponse';
import { FeaturedResponse } from '../models/FeaturedResponse';
import { FeaturedToggle } from '../models/FeaturedToggle';
import { Governance } from '../models/Governance';
import { GovernanceModel } from '../models/GovernanceModel';
import { GovernanceModelsList } from '../models/GovernanceModelsList';
import { GovernanceResponse } from '../models/GovernanceResponse';
import { InitDAOResponse } from '../models/InitDAOResponse';
import { InputCreateDAO } from '../models/InputCreateDAO';
import { InputCreateGovernance } from '../models/InputCreateGovernance';
import { InputCreatePOD } from '../models/InputCreatePOD';
import { InputCreateProposal } from '../models/InputCreateProposal';
import { InputCreateRole } from '../models/InputCreateRole';
import { InputCreateUser } from '../models/InputCreateUser';
import { InputInitDAO } from '../models/InputInitDAO';
import { InputUpdateGovernance } from '../models/InputUpdateGovernance';
import { InputUpdateRole } from '../models/InputUpdateRole';
import { InputUpdateUser } from '../models/InputUpdateUser';
import { LinkDiscordChannel } from '../models/LinkDiscordChannel';
import { LoginResponse } from '../models/LoginResponse';
import { LogoutResponse } from '../models/LogoutResponse';
import { ModelError } from '../models/ModelError';
import { OAuthError } from '../models/OAuthError';
import { OAuthResponse } from '../models/OAuthResponse';
import { POD } from '../models/POD';
import { PODMembership } from '../models/PODMembership';
import { PODMembershipResponse } from '../models/PODMembershipResponse';
import { PODSchemaResponse } from '../models/PODSchemaResponse';
import { PODUpdate } from '../models/PODUpdate';
import { PaginationMetadata } from '../models/PaginationMetadata';
import { PagingError } from '../models/PagingError';
import { Permission } from '../models/Permission';
import { PermissionListResponse } from '../models/PermissionListResponse';
import { PodBasic } from '../models/PodBasic';
import { PodProposalListResponse } from '../models/PodProposalListResponse';
import { Proposal } from '../models/Proposal';
import { ProposalAction } from '../models/ProposalAction';
import { ProposalSchemaResponse } from '../models/ProposalSchemaResponse';
import { ProposalUpdate } from '../models/ProposalUpdate';
import { ProposalVote } from '../models/ProposalVote';
import { ProposalVoteResponse } from '../models/ProposalVoteResponse';
import { Role } from '../models/Role';
import { RoleListResponse } from '../models/RoleListResponse';
import { RolePermissionAssignment } from '../models/RolePermissionAssignment';
import { RolePermissionResponse } from '../models/RolePermissionResponse';
import { RoleResponse } from '../models/RoleResponse';
import { SocialConnection } from '../models/SocialConnection';
import { TelegramAuth } from '../models/TelegramAuth';
import { Token } from '../models/Token';
import { Transfer } from '../models/Transfer';
import { TransferCreate } from '../models/TransferCreate';
import { TransferSchemaResponse } from '../models/TransferSchemaResponse';
import { Treasury } from '../models/Treasury';
import { User } from '../models/User';
import { UserApplication } from '../models/UserApplication';
import { UserApplicationResponse } from '../models/UserApplicationResponse';
import { UserBasic } from '../models/UserBasic';
import { UserDAOOwnershipResponse } from '../models/UserDAOOwnershipResponse';
import { UserDetailed } from '../models/UserDetailed';
import { UserExistResponse } from '../models/UserExistResponse';
import { UserInfoError } from '../models/UserInfoError';
import { UserInvitation } from '../models/UserInvitation';
import { UserInvitationsResponse } from '../models/UserInvitationsResponse';
import { UserPermissionCheck } from '../models/UserPermissionCheck';
import { UserResponse } from '../models/UserResponse';
import { UserRoleAssignment } from '../models/UserRoleAssignment';
import { UserRoleCheck } from '../models/UserRoleCheck';
import { UserRoleResponse } from '../models/UserRoleResponse';
import { UserSearchResponse } from '../models/UserSearchResponse';
import { UserStric } from '../models/UserStric';
import { VerifySignature } from '../models/VerifySignature';

import { ObservableApiKeysApi } from "./ObservableAPI";
import { ApiKeysApiRequestFactory, ApiKeysApiResponseProcessor} from "../apis/ApiKeysApi";

export interface ApiKeysApiApikeysDeviceIdDeleteRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ApiKeysApiapikeysDeviceIdDelete
     */
    deviceId: string
}

export interface ApiKeysApiCreateAPIKeyRequest {
    /**
     * 
     * @type CreateDeviceRequest
     * @memberof ApiKeysApicreateAPIKey
     */
    createDeviceRequest: CreateDeviceRequest
}

export interface ApiKeysApiGetAPIKeysRequest {
}

export class ObjectApiKeysApi {
    private api: ObservableApiKeysApi

    public constructor(configuration: Configuration, requestFactory?: ApiKeysApiRequestFactory, responseProcessor?: ApiKeysApiResponseProcessor) {
        this.api = new ObservableApiKeysApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete an API key
     * @param param the request object
     */
    public apikeysDeviceIdDeleteWithHttpInfo(param: ApiKeysApiApikeysDeviceIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<DeleteDeviceResponse>> {
        return this.api.apikeysDeviceIdDeleteWithHttpInfo(param.deviceId,  options).toPromise();
    }

    /**
     * Delete an API key
     * @param param the request object
     */
    public apikeysDeviceIdDelete(param: ApiKeysApiApikeysDeviceIdDeleteRequest, options?: ConfigurationOptions): Promise<DeleteDeviceResponse> {
        return this.api.apikeysDeviceIdDelete(param.deviceId,  options).toPromise();
    }

    /**
     * Creates a new API key and returns it to the user.
     * Create a new API key for the authenticated user
     * @param param the request object
     */
    public createAPIKeyWithHttpInfo(param: ApiKeysApiCreateAPIKeyRequest, options?: ConfigurationOptions): Promise<HttpInfo<CreateDeviceResponse>> {
        return this.api.createAPIKeyWithHttpInfo(param.createDeviceRequest,  options).toPromise();
    }

    /**
     * Creates a new API key and returns it to the user.
     * Create a new API key for the authenticated user
     * @param param the request object
     */
    public createAPIKey(param: ApiKeysApiCreateAPIKeyRequest, options?: ConfigurationOptions): Promise<CreateDeviceResponse> {
        return this.api.createAPIKey(param.createDeviceRequest,  options).toPromise();
    }

    /**
     * Returns a list of API keys (with sensitive information removed)
     * List all API keys for the authenticated user
     * @param param the request object
     */
    public getAPIKeysWithHttpInfo(param: ApiKeysApiGetAPIKeysRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<DeviceList>> {
        return this.api.getAPIKeysWithHttpInfo( options).toPromise();
    }

    /**
     * Returns a list of API keys (with sensitive information removed)
     * List all API keys for the authenticated user
     * @param param the request object
     */
    public getAPIKeys(param: ApiKeysApiGetAPIKeysRequest = {}, options?: ConfigurationOptions): Promise<DeviceList> {
        return this.api.getAPIKeys( options).toPromise();
    }

}

import { ObservableAuthApi } from "./ObservableAPI";
import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";

export interface AuthApiGetWalletChallengeRequest {
    /**
     * 
     * @type ChallengeRequest
     * @memberof AuthApigetWalletChallenge
     */
    challengeRequest: ChallengeRequest
}

export interface AuthApiLogoutRequest {
}

export interface AuthApiRefreshAccessTokenRequest {
}

export interface AuthApiVerifyWalletSignatureRequest {
    /**
     * 
     * @type VerifySignature
     * @memberof AuthApiverifyWalletSignature
     */
    verifySignature: VerifySignature
}

export class ObjectAuthApi {
    private api: ObservableAuthApi

    public constructor(configuration: Configuration, requestFactory?: AuthApiRequestFactory, responseProcessor?: AuthApiResponseProcessor) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Generate a challenge message for Solana wallet signature authentication
     * @param param the request object
     */
    public getWalletChallengeWithHttpInfo(param: AuthApiGetWalletChallengeRequest, options?: ConfigurationOptions): Promise<HttpInfo<ChallengeResponse>> {
        return this.api.getWalletChallengeWithHttpInfo(param.challengeRequest,  options).toPromise();
    }

    /**
     * Generate a challenge message for Solana wallet signature authentication
     * @param param the request object
     */
    public getWalletChallenge(param: AuthApiGetWalletChallengeRequest, options?: ConfigurationOptions): Promise<ChallengeResponse> {
        return this.api.getWalletChallenge(param.challengeRequest,  options).toPromise();
    }

    /**
     * Logout the user
     * @param param the request object
     */
    public logoutWithHttpInfo(param: AuthApiLogoutRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<LogoutResponse>> {
        return this.api.logoutWithHttpInfo( options).toPromise();
    }

    /**
     * Logout the user
     * @param param the request object
     */
    public logout(param: AuthApiLogoutRequest = {}, options?: ConfigurationOptions): Promise<LogoutResponse> {
        return this.api.logout( options).toPromise();
    }

    /**
     * Refresh access token using a valid refresh token
     * @param param the request object
     */
    public refreshAccessTokenWithHttpInfo(param: AuthApiRefreshAccessTokenRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<LoginResponse>> {
        return this.api.refreshAccessTokenWithHttpInfo( options).toPromise();
    }

    /**
     * Refresh access token using a valid refresh token
     * @param param the request object
     */
    public refreshAccessToken(param: AuthApiRefreshAccessTokenRequest = {}, options?: ConfigurationOptions): Promise<LoginResponse> {
        return this.api.refreshAccessToken( options).toPromise();
    }

    /**
     * Verify a Solana wallet signature and authenticate the user
     * @param param the request object
     */
    public verifyWalletSignatureWithHttpInfo(param: AuthApiVerifyWalletSignatureRequest, options?: ConfigurationOptions): Promise<HttpInfo<LoginResponse>> {
        return this.api.verifyWalletSignatureWithHttpInfo(param.verifySignature,  options).toPromise();
    }

    /**
     * Verify a Solana wallet signature and authenticate the user
     * @param param the request object
     */
    public verifyWalletSignature(param: AuthApiVerifyWalletSignatureRequest, options?: ConfigurationOptions): Promise<LoginResponse> {
        return this.api.verifyWalletSignature(param.verifySignature,  options).toPromise();
    }

}

import { ObservableDaosApi } from "./ObservableAPI";
import { DaosApiRequestFactory, DaosApiResponseProcessor} from "../apis/DaosApi";

export interface DaosApiAccessDAOModuleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaccessDAOModule
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaccessDAOModule
     */
    moduleName: string
}

export interface DaosApiAddAdminToDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaddAdminToDAO
     */
    daoId: string
    /**
     * 
     * @type DAOMembership
     * @memberof DaosApiaddAdminToDAO
     */
    dAOMembership: DAOMembership
}

export interface DaosApiAddDAOModuleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaddDAOModule
     */
    daoId: string
    /**
     * 
     * @type DAOModule
     * @memberof DaosApiaddDAOModule
     */
    dAOModule: DAOModule
}

export interface DaosApiAddMemberToDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaddMemberToDAO
     */
    daoId: string
}

export interface DaosApiAddMemberToPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaddMemberToPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiaddMemberToPOD
     */
    podId: string
}

export interface DaosApiApplyToDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiapplyToDAO
     */
    daoId: string
    /**
     * 
     * @type DAOApplication
     * @memberof DaosApiapplyToDAO
     */
    dAOApplication?: DAOApplication
}

export interface DaosApiAssignPermissionToRoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiassignPermissionToRole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiassignPermissionToRole
     */
    roleId: string
    /**
     * 
     * @type RolePermissionAssignment
     * @memberof DaosApiassignPermissionToRole
     */
    rolePermissionAssignment: RolePermissionAssignment
}

export interface DaosApiAssignRoleToUserRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiassignRoleToUser
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiassignRoleToUser
     */
    userId: string
    /**
     * 
     * @type UserRoleAssignment
     * @memberof DaosApiassignRoleToUser
     */
    userRoleAssignment: UserRoleAssignment
}

export interface DaosApiCancelDAOInvitationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicancelDAOInvitation
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicancelDAOInvitation
     */
    invitationId: string
}

export interface DaosApiCheckDAOInitializationRequest {
}

export interface DaosApiCheckUserDAOOwnershipRequest {
}

export interface DaosApiCheckUserPermissionRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserPermission
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserPermission
     */
    userId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserPermission
     */
    permissionId: string
}

export interface DaosApiCheckUserRoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserRole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserRole
     */
    userId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicheckUserRole
     */
    roleId: string
}

export interface DaosApiCreateDAORequest {
    /**
     * 
     * @type InputCreateDAO
     * @memberof DaosApicreateDAO
     */
    inputCreateDAO: InputCreateDAO
}

export interface DaosApiCreateDAORoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicreateDAORole
     */
    daoId: string
    /**
     * 
     * @type InputCreateRole
     * @memberof DaosApicreateDAORole
     */
    inputCreateRole: InputCreateRole
}

export interface DaosApiCreatePODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApicreatePOD
     */
    daoId: string
    /**
     * 
     * @type InputCreatePOD
     * @memberof DaosApicreatePOD
     */
    inputCreatePOD: InputCreatePOD
}

export interface DaosApiDeleteDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideleteDAO
     */
    daoId: string
}

export interface DaosApiDeleteDAOApplicationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideleteDAOApplication
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideleteDAOApplication
     */
    applicationId: string
}

export interface DaosApiDeleteDAORoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideleteDAORole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideleteDAORole
     */
    roleId: string
}

export interface DaosApiDeletePODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideletePOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApideletePOD
     */
    podId: string
}

export interface DaosApiEnableDAOFeaturedRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApienableDAOFeatured
     */
    daoId: string
    /**
     * 
     * @type FeaturedToggle
     * @memberof DaosApienableDAOFeatured
     */
    featuredToggle: FeaturedToggle
}

export interface DaosApiGetAllDAOsRequest {
}

export interface DaosApiGetAllMembersOfPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetAllMembersOfPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetAllMembersOfPOD
     */
    podId: string
}

export interface DaosApiGetAllPODsForDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetAllPODsForDAO
     */
    daoId: string
}

export interface DaosApiGetChannelMessagesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetChannelMessages
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetChannelMessages
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetChannelMessages
     */
    channelId: string
}

export interface DaosApiGetDAOApplicationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOApplication
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOApplication
     */
    applicationId: string
}

export interface DaosApiGetDAOApplicationsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOApplications
     */
    daoId: string
}

export interface DaosApiGetDAOByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOById
     */
    daoId: string
}

export interface DaosApiGetDAOFeaturedStatusRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOFeaturedStatus
     */
    daoId: string
}

export interface DaosApiGetDAOGovernanceRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOGovernance
     */
    daoId: string
}

export interface DaosApiGetDAOInvitationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOInvitation
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOInvitation
     */
    invitationId: string
}

export interface DaosApiGetDAOInvitationsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOInvitations
     */
    daoId: string
}

export interface DaosApiGetDAOModulesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOModules
     */
    daoId: string
}

export interface DaosApiGetDAOPermissionsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAOPermissions
     */
    daoId: string
}

export interface DaosApiGetDAORoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAORole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAORole
     */
    roleId: string
}

export interface DaosApiGetDAORolesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetDAORoles
     */
    daoId: string
}

export interface DaosApiGetGovernanceModelsRequest {
}

export interface DaosApiGetPODByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODById
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODById
     */
    podId: string
}

export interface DaosApiGetPODDiscordChannelsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODDiscordChannels
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODDiscordChannels
     */
    podId: string
}

export interface DaosApiGetPODFeedRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODFeed
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetPODFeed
     */
    podId: string
}

export interface DaosApiGetRolePermissionsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetRolePermissions
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetRolePermissions
     */
    roleId: string
}

export interface DaosApiGetUserPermissionsRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetUserPermissions
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetUserPermissions
     */
    userId: string
}

export interface DaosApiGetUserRolesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetUserRoles
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApigetUserRoles
     */
    userId: string
}

export interface DaosApiInitializeDAOCreationRequest {
    /**
     * 
     * @type InputInitDAO
     * @memberof DaosApiinitializeDAOCreation
     */
    inputInitDAO: InputInitDAO
}

export interface DaosApiInitializeDAOGovernanceRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiinitializeDAOGovernance
     */
    daoId: string
    /**
     * 
     * @type InputCreateGovernance
     * @memberof DaosApiinitializeDAOGovernance
     */
    inputCreateGovernance: InputCreateGovernance
}

export interface DaosApiInviteUserToDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiinviteUserToDAO
     */
    daoId: string
    /**
     * 
     * @type DAOInvitation
     * @memberof DaosApiinviteUserToDAO
     */
    dAOInvitation: DAOInvitation
}

export interface DaosApiLinkDiscordChannelToPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApilinkDiscordChannelToPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApilinkDiscordChannelToPOD
     */
    podId: string
    /**
     * 
     * @type LinkDiscordChannel
     * @memberof DaosApilinkDiscordChannelToPOD
     */
    linkDiscordChannel: LinkDiscordChannel
}

export interface DaosApiRemoveAdminFromDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveAdminFromDAO
     */
    daoId: string
    /**
     * 
     * @type DAOMembership
     * @memberof DaosApiremoveAdminFromDAO
     */
    dAOMembership: DAOMembership
}

export interface DaosApiRemoveDAOModuleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveDAOModule
     */
    daoId: string
    /**
     * 
     * @type DAOModule
     * @memberof DaosApiremoveDAOModule
     */
    dAOModule: DAOModule
}

export interface DaosApiRemoveMemberFromDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveMemberFromDAO
     */
    daoId: string
    /**
     * 
     * @type DAOMembership
     * @memberof DaosApiremoveMemberFromDAO
     */
    dAOMembership: DAOMembership
}

export interface DaosApiRemoveMemberFromPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveMemberFromPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveMemberFromPOD
     */
    podId: string
    /**
     * 
     * @type PODMembership
     * @memberof DaosApiremoveMemberFromPOD
     */
    pODMembership: PODMembership
}

export interface DaosApiRemovePermissionFromRoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremovePermissionFromRole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremovePermissionFromRole
     */
    roleId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremovePermissionFromRole
     */
    permissionId: string
}

export interface DaosApiRemoveRoleFromUserRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveRoleFromUser
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveRoleFromUser
     */
    userId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiremoveRoleFromUser
     */
    roleId: string
}

export interface DaosApiRespondToDAOApplicationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApirespondToDAOApplication
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApirespondToDAOApplication
     */
    applicationId: string
    /**
     * 
     * @type DAOApplicationAction
     * @memberof DaosApirespondToDAOApplication
     */
    dAOApplicationAction: DAOApplicationAction
}

export interface DaosApiRespondToDAOInvitationRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApirespondToDAOInvitation
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApirespondToDAOInvitation
     */
    invitationId: string
    /**
     * 
     * @type DAOInvitationAction
     * @memberof DaosApirespondToDAOInvitation
     */
    dAOInvitationAction: DAOInvitationAction
}

export interface DaosApiUnlinkDiscordChannelFromPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiunlinkDiscordChannelFromPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiunlinkDiscordChannelFromPOD
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiunlinkDiscordChannelFromPOD
     */
    channelId: string
}

export interface DaosApiUpdateDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdateDAO
     */
    daoId: string
    /**
     * 
     * @type DAOUpdate
     * @memberof DaosApiupdateDAO
     */
    dAOUpdate: DAOUpdate
}

export interface DaosApiUpdateDAOGovernanceRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdateDAOGovernance
     */
    daoId: string
    /**
     * 
     * @type InputUpdateGovernance
     * @memberof DaosApiupdateDAOGovernance
     */
    inputUpdateGovernance: InputUpdateGovernance
}

export interface DaosApiUpdateDAORoleRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdateDAORole
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdateDAORole
     */
    roleId: string
    /**
     * 
     * @type InputUpdateRole
     * @memberof DaosApiupdateDAORole
     */
    inputUpdateRole: InputUpdateRole
}

export interface DaosApiUpdatePODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdatePOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DaosApiupdatePOD
     */
    podId: string
    /**
     * 
     * @type PODUpdate
     * @memberof DaosApiupdatePOD
     */
    pODUpdate: PODUpdate
}

export class ObjectDaosApi {
    private api: ObservableDaosApi

    public constructor(configuration: Configuration, requestFactory?: DaosApiRequestFactory, responseProcessor?: DaosApiResponseProcessor) {
        this.api = new ObservableDaosApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Access a specific module for a DAO
     * @param param the request object
     */
    public accessDAOModuleWithHttpInfo(param: DaosApiAccessDAOModuleRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOModuleAccessResponse>> {
        return this.api.accessDAOModuleWithHttpInfo(param.daoId, param.moduleName,  options).toPromise();
    }

    /**
     * Access a specific module for a DAO
     * @param param the request object
     */
    public accessDAOModule(param: DaosApiAccessDAOModuleRequest, options?: ConfigurationOptions): Promise<DAOModuleAccessResponse> {
        return this.api.accessDAOModule(param.daoId, param.moduleName,  options).toPromise();
    }

    /**
     * Add an admin to a DAO
     * @param param the request object
     */
    public addAdminToDAOWithHttpInfo(param: DaosApiAddAdminToDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOMembershipResponse>> {
        return this.api.addAdminToDAOWithHttpInfo(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Add an admin to a DAO
     * @param param the request object
     */
    public addAdminToDAO(param: DaosApiAddAdminToDAORequest, options?: ConfigurationOptions): Promise<DAOMembershipResponse> {
        return this.api.addAdminToDAO(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Add a module to a DAO
     * @param param the request object
     */
    public addDAOModuleWithHttpInfo(param: DaosApiAddDAOModuleRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOModuleResponse>> {
        return this.api.addDAOModuleWithHttpInfo(param.daoId, param.dAOModule,  options).toPromise();
    }

    /**
     * Add a module to a DAO
     * @param param the request object
     */
    public addDAOModule(param: DaosApiAddDAOModuleRequest, options?: ConfigurationOptions): Promise<DAOModuleResponse> {
        return this.api.addDAOModule(param.daoId, param.dAOModule,  options).toPromise();
    }

    /**
     * Add a member to a DAO
     * @param param the request object
     */
    public addMemberToDAOWithHttpInfo(param: DaosApiAddMemberToDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOMembershipResponse>> {
        return this.api.addMemberToDAOWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Add a member to a DAO
     * @param param the request object
     */
    public addMemberToDAO(param: DaosApiAddMemberToDAORequest, options?: ConfigurationOptions): Promise<DAOMembershipResponse> {
        return this.api.addMemberToDAO(param.daoId,  options).toPromise();
    }

    /**
     * Add a member to a POD
     * @param param the request object
     */
    public addMemberToPODWithHttpInfo(param: DaosApiAddMemberToPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PODMembershipResponse>> {
        return this.api.addMemberToPODWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Add a member to a POD
     * @param param the request object
     */
    public addMemberToPOD(param: DaosApiAddMemberToPODRequest, options?: ConfigurationOptions): Promise<PODMembershipResponse> {
        return this.api.addMemberToPOD(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Create an application to join a DAO
     * @param param the request object
     */
    public applyToDAOWithHttpInfo(param: DaosApiApplyToDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOApplicationResponse>> {
        return this.api.applyToDAOWithHttpInfo(param.daoId, param.dAOApplication,  options).toPromise();
    }

    /**
     * Create an application to join a DAO
     * @param param the request object
     */
    public applyToDAO(param: DaosApiApplyToDAORequest, options?: ConfigurationOptions): Promise<DAOApplicationResponse> {
        return this.api.applyToDAO(param.daoId, param.dAOApplication,  options).toPromise();
    }

    /**
     * Assign a permission to a role in a DAO
     * @param param the request object
     */
    public assignPermissionToRoleWithHttpInfo(param: DaosApiAssignPermissionToRoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<RolePermissionResponse>> {
        return this.api.assignPermissionToRoleWithHttpInfo(param.daoId, param.roleId, param.rolePermissionAssignment,  options).toPromise();
    }

    /**
     * Assign a permission to a role in a DAO
     * @param param the request object
     */
    public assignPermissionToRole(param: DaosApiAssignPermissionToRoleRequest, options?: ConfigurationOptions): Promise<RolePermissionResponse> {
        return this.api.assignPermissionToRole(param.daoId, param.roleId, param.rolePermissionAssignment,  options).toPromise();
    }

    /**
     * Assign a role to a user in a DAO
     * @param param the request object
     */
    public assignRoleToUserWithHttpInfo(param: DaosApiAssignRoleToUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserRoleResponse>> {
        return this.api.assignRoleToUserWithHttpInfo(param.daoId, param.userId, param.userRoleAssignment,  options).toPromise();
    }

    /**
     * Assign a role to a user in a DAO
     * @param param the request object
     */
    public assignRoleToUser(param: DaosApiAssignRoleToUserRequest, options?: ConfigurationOptions): Promise<UserRoleResponse> {
        return this.api.assignRoleToUser(param.daoId, param.userId, param.userRoleAssignment,  options).toPromise();
    }

    /**
     * Cancel/delete a DAO invitation
     * @param param the request object
     */
    public cancelDAOInvitationWithHttpInfo(param: DaosApiCancelDAOInvitationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOInvitationResponse>> {
        return this.api.cancelDAOInvitationWithHttpInfo(param.daoId, param.invitationId,  options).toPromise();
    }

    /**
     * Cancel/delete a DAO invitation
     * @param param the request object
     */
    public cancelDAOInvitation(param: DaosApiCancelDAOInvitationRequest, options?: ConfigurationOptions): Promise<DAOInvitationResponse> {
        return this.api.cancelDAOInvitation(param.daoId, param.invitationId,  options).toPromise();
    }

    /**
     * Check if user has already initialized DAO creation (useful after disconnections)
     * @param param the request object
     */
    public checkDAOInitializationWithHttpInfo(param: DaosApiCheckDAOInitializationRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<InitDAOResponse>> {
        return this.api.checkDAOInitializationWithHttpInfo( options).toPromise();
    }

    /**
     * Check if user has already initialized DAO creation (useful after disconnections)
     * @param param the request object
     */
    public checkDAOInitialization(param: DaosApiCheckDAOInitializationRequest = {}, options?: ConfigurationOptions): Promise<InitDAOResponse> {
        return this.api.checkDAOInitialization( options).toPromise();
    }

    /**
     * Check if the authenticated user owns a DAO
     * @param param the request object
     */
    public checkUserDAOOwnershipWithHttpInfo(param: DaosApiCheckUserDAOOwnershipRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<UserDAOOwnershipResponse>> {
        return this.api.checkUserDAOOwnershipWithHttpInfo( options).toPromise();
    }

    /**
     * Check if the authenticated user owns a DAO
     * @param param the request object
     */
    public checkUserDAOOwnership(param: DaosApiCheckUserDAOOwnershipRequest = {}, options?: ConfigurationOptions): Promise<UserDAOOwnershipResponse> {
        return this.api.checkUserDAOOwnership( options).toPromise();
    }

    /**
     * Check if a user has a specific permission in a DAO
     * @param param the request object
     */
    public checkUserPermissionWithHttpInfo(param: DaosApiCheckUserPermissionRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserPermissionCheck>> {
        return this.api.checkUserPermissionWithHttpInfo(param.daoId, param.userId, param.permissionId,  options).toPromise();
    }

    /**
     * Check if a user has a specific permission in a DAO
     * @param param the request object
     */
    public checkUserPermission(param: DaosApiCheckUserPermissionRequest, options?: ConfigurationOptions): Promise<UserPermissionCheck> {
        return this.api.checkUserPermission(param.daoId, param.userId, param.permissionId,  options).toPromise();
    }

    /**
     * Check if a user has a specific role in a DAO
     * @param param the request object
     */
    public checkUserRoleWithHttpInfo(param: DaosApiCheckUserRoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserRoleCheck>> {
        return this.api.checkUserRoleWithHttpInfo(param.daoId, param.userId, param.roleId,  options).toPromise();
    }

    /**
     * Check if a user has a specific role in a DAO
     * @param param the request object
     */
    public checkUserRole(param: DaosApiCheckUserRoleRequest, options?: ConfigurationOptions): Promise<UserRoleCheck> {
        return this.api.checkUserRole(param.daoId, param.userId, param.roleId,  options).toPromise();
    }

    /**
     * Create a new DAO (Step 2) - Complete DAO creation with all required fields
     * @param param the request object
     */
    public createDAOWithHttpInfo(param: DaosApiCreateDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOSchemaResponse>> {
        return this.api.createDAOWithHttpInfo(param.inputCreateDAO,  options).toPromise();
    }

    /**
     * Create a new DAO (Step 2) - Complete DAO creation with all required fields
     * @param param the request object
     */
    public createDAO(param: DaosApiCreateDAORequest, options?: ConfigurationOptions): Promise<DAOSchemaResponse> {
        return this.api.createDAO(param.inputCreateDAO,  options).toPromise();
    }

    /**
     * Create a new role for a DAO
     * @param param the request object
     */
    public createDAORoleWithHttpInfo(param: DaosApiCreateDAORoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<RoleResponse>> {
        return this.api.createDAORoleWithHttpInfo(param.daoId, param.inputCreateRole,  options).toPromise();
    }

    /**
     * Create a new role for a DAO
     * @param param the request object
     */
    public createDAORole(param: DaosApiCreateDAORoleRequest, options?: ConfigurationOptions): Promise<RoleResponse> {
        return this.api.createDAORole(param.daoId, param.inputCreateRole,  options).toPromise();
    }

    /**
     * Create a new POD
     * @param param the request object
     */
    public createPODWithHttpInfo(param: DaosApiCreatePODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PODSchemaResponse>> {
        return this.api.createPODWithHttpInfo(param.daoId, param.inputCreatePOD,  options).toPromise();
    }

    /**
     * Create a new POD
     * @param param the request object
     */
    public createPOD(param: DaosApiCreatePODRequest, options?: ConfigurationOptions): Promise<PODSchemaResponse> {
        return this.api.createPOD(param.daoId, param.inputCreatePOD,  options).toPromise();
    }

    /**
     * Delete a DAO
     * @param param the request object
     */
    public deleteDAOWithHttpInfo(param: DaosApiDeleteDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOSchemaResponse>> {
        return this.api.deleteDAOWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Delete a DAO
     * @param param the request object
     */
    public deleteDAO(param: DaosApiDeleteDAORequest, options?: ConfigurationOptions): Promise<DAOSchemaResponse> {
        return this.api.deleteDAO(param.daoId,  options).toPromise();
    }

    /**
     * Delete a DAO application
     * @param param the request object
     */
    public deleteDAOApplicationWithHttpInfo(param: DaosApiDeleteDAOApplicationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOApplicationResponse>> {
        return this.api.deleteDAOApplicationWithHttpInfo(param.daoId, param.applicationId,  options).toPromise();
    }

    /**
     * Delete a DAO application
     * @param param the request object
     */
    public deleteDAOApplication(param: DaosApiDeleteDAOApplicationRequest, options?: ConfigurationOptions): Promise<DAOApplicationResponse> {
        return this.api.deleteDAOApplication(param.daoId, param.applicationId,  options).toPromise();
    }

    /**
     * Delete a role from a DAO
     * @param param the request object
     */
    public deleteDAORoleWithHttpInfo(param: DaosApiDeleteDAORoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<RoleResponse>> {
        return this.api.deleteDAORoleWithHttpInfo(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Delete a role from a DAO
     * @param param the request object
     */
    public deleteDAORole(param: DaosApiDeleteDAORoleRequest, options?: ConfigurationOptions): Promise<RoleResponse> {
        return this.api.deleteDAORole(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Delete a POD
     * @param param the request object
     */
    public deletePODWithHttpInfo(param: DaosApiDeletePODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PODSchemaResponse>> {
        return this.api.deletePODWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Delete a POD
     * @param param the request object
     */
    public deletePOD(param: DaosApiDeletePODRequest, options?: ConfigurationOptions): Promise<PODSchemaResponse> {
        return this.api.deletePOD(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Enable a DAO\'s featured option
     * @param param the request object
     */
    public enableDAOFeaturedWithHttpInfo(param: DaosApiEnableDAOFeaturedRequest, options?: ConfigurationOptions): Promise<HttpInfo<FeaturedResponse>> {
        return this.api.enableDAOFeaturedWithHttpInfo(param.daoId, param.featuredToggle,  options).toPromise();
    }

    /**
     * Enable a DAO\'s featured option
     * @param param the request object
     */
    public enableDAOFeatured(param: DaosApiEnableDAOFeaturedRequest, options?: ConfigurationOptions): Promise<FeaturedResponse> {
        return this.api.enableDAOFeatured(param.daoId, param.featuredToggle,  options).toPromise();
    }

    /**
     * List all DAOs
     * @param param the request object
     */
    public getAllDAOsWithHttpInfo(param: DaosApiGetAllDAOsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<DAO>>> {
        return this.api.getAllDAOsWithHttpInfo( options).toPromise();
    }

    /**
     * List all DAOs
     * @param param the request object
     */
    public getAllDAOs(param: DaosApiGetAllDAOsRequest = {}, options?: ConfigurationOptions): Promise<Array<DAO>> {
        return this.api.getAllDAOs( options).toPromise();
    }

    /**
     * Get all members of a POD
     * @param param the request object
     */
    public getAllMembersOfPODWithHttpInfo(param: DaosApiGetAllMembersOfPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<User>>> {
        return this.api.getAllMembersOfPODWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all members of a POD
     * @param param the request object
     */
    public getAllMembersOfPOD(param: DaosApiGetAllMembersOfPODRequest, options?: ConfigurationOptions): Promise<Array<User>> {
        return this.api.getAllMembersOfPOD(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all PODs for a DAO
     * @param param the request object
     */
    public getAllPODsForDAOWithHttpInfo(param: DaosApiGetAllPODsForDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<POD>>> {
        return this.api.getAllPODsForDAOWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all PODs for a DAO
     * @param param the request object
     */
    public getAllPODsForDAO(param: DaosApiGetAllPODsForDAORequest, options?: ConfigurationOptions): Promise<Array<POD>> {
        return this.api.getAllPODsForDAO(param.daoId,  options).toPromise();
    }

    /**
     * Get messages from a specific Discord channel
     * @param param the request object
     */
    public getChannelMessagesWithHttpInfo(param: DaosApiGetChannelMessagesRequest, options?: ConfigurationOptions): Promise<HttpInfo<DiscordMessagesResponse>> {
        return this.api.getChannelMessagesWithHttpInfo(param.daoId, param.podId, param.channelId,  options).toPromise();
    }

    /**
     * Get messages from a specific Discord channel
     * @param param the request object
     */
    public getChannelMessages(param: DaosApiGetChannelMessagesRequest, options?: ConfigurationOptions): Promise<DiscordMessagesResponse> {
        return this.api.getChannelMessages(param.daoId, param.podId, param.channelId,  options).toPromise();
    }

    /**
     * Get details of a specific application
     * @param param the request object
     */
    public getDAOApplicationWithHttpInfo(param: DaosApiGetDAOApplicationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOApplicationResponse>> {
        return this.api.getDAOApplicationWithHttpInfo(param.daoId, param.applicationId,  options).toPromise();
    }

    /**
     * Get details of a specific application
     * @param param the request object
     */
    public getDAOApplication(param: DaosApiGetDAOApplicationRequest, options?: ConfigurationOptions): Promise<DAOApplicationResponse> {
        return this.api.getDAOApplication(param.daoId, param.applicationId,  options).toPromise();
    }

    /**
     * Get all pending applications for a DAO
     * @param param the request object
     */
    public getDAOApplicationsWithHttpInfo(param: DaosApiGetDAOApplicationsRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOApplicationList>> {
        return this.api.getDAOApplicationsWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all pending applications for a DAO
     * @param param the request object
     */
    public getDAOApplications(param: DaosApiGetDAOApplicationsRequest, options?: ConfigurationOptions): Promise<DAOApplicationList> {
        return this.api.getDAOApplications(param.daoId,  options).toPromise();
    }

    /**
     * Get a DAO by ID
     * @param param the request object
     */
    public getDAOByIdWithHttpInfo(param: DaosApiGetDAOByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAO>> {
        return this.api.getDAOByIdWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get a DAO by ID
     * @param param the request object
     */
    public getDAOById(param: DaosApiGetDAOByIdRequest, options?: ConfigurationOptions): Promise<DAO> {
        return this.api.getDAOById(param.daoId,  options).toPromise();
    }

    /**
     * Get a DAO\'s featured status
     * @param param the request object
     */
    public getDAOFeaturedStatusWithHttpInfo(param: DaosApiGetDAOFeaturedStatusRequest, options?: ConfigurationOptions): Promise<HttpInfo<FeaturedResponse>> {
        return this.api.getDAOFeaturedStatusWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get a DAO\'s featured status
     * @param param the request object
     */
    public getDAOFeaturedStatus(param: DaosApiGetDAOFeaturedStatusRequest, options?: ConfigurationOptions): Promise<FeaturedResponse> {
        return this.api.getDAOFeaturedStatus(param.daoId,  options).toPromise();
    }

    /**
     * Get governance model for a DAO
     * @param param the request object
     */
    public getDAOGovernanceWithHttpInfo(param: DaosApiGetDAOGovernanceRequest, options?: ConfigurationOptions): Promise<HttpInfo<Governance>> {
        return this.api.getDAOGovernanceWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get governance model for a DAO
     * @param param the request object
     */
    public getDAOGovernance(param: DaosApiGetDAOGovernanceRequest, options?: ConfigurationOptions): Promise<Governance> {
        return this.api.getDAOGovernance(param.daoId,  options).toPromise();
    }

    /**
     * Get details of a specific invitation
     * @param param the request object
     */
    public getDAOInvitationWithHttpInfo(param: DaosApiGetDAOInvitationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOInvitationResponse>> {
        return this.api.getDAOInvitationWithHttpInfo(param.daoId, param.invitationId,  options).toPromise();
    }

    /**
     * Get details of a specific invitation
     * @param param the request object
     */
    public getDAOInvitation(param: DaosApiGetDAOInvitationRequest, options?: ConfigurationOptions): Promise<DAOInvitationResponse> {
        return this.api.getDAOInvitation(param.daoId, param.invitationId,  options).toPromise();
    }

    /**
     * Get all invitations for a DAO
     * @param param the request object
     */
    public getDAOInvitationsWithHttpInfo(param: DaosApiGetDAOInvitationsRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOInvitationList>> {
        return this.api.getDAOInvitationsWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all invitations for a DAO
     * @param param the request object
     */
    public getDAOInvitations(param: DaosApiGetDAOInvitationsRequest, options?: ConfigurationOptions): Promise<DAOInvitationList> {
        return this.api.getDAOInvitations(param.daoId,  options).toPromise();
    }

    /**
     * Get all modules enabled for a DAO
     * @param param the request object
     */
    public getDAOModulesWithHttpInfo(param: DaosApiGetDAOModulesRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOModulesList>> {
        return this.api.getDAOModulesWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all modules enabled for a DAO
     * @param param the request object
     */
    public getDAOModules(param: DaosApiGetDAOModulesRequest, options?: ConfigurationOptions): Promise<DAOModulesList> {
        return this.api.getDAOModules(param.daoId,  options).toPromise();
    }

    /**
     * Get all permissions available for a DAO
     * @param param the request object
     */
    public getDAOPermissionsWithHttpInfo(param: DaosApiGetDAOPermissionsRequest, options?: ConfigurationOptions): Promise<HttpInfo<PermissionListResponse>> {
        return this.api.getDAOPermissionsWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all permissions available for a DAO
     * @param param the request object
     */
    public getDAOPermissions(param: DaosApiGetDAOPermissionsRequest, options?: ConfigurationOptions): Promise<PermissionListResponse> {
        return this.api.getDAOPermissions(param.daoId,  options).toPromise();
    }

    /**
     * Get a specific role for a DAO
     * @param param the request object
     */
    public getDAORoleWithHttpInfo(param: DaosApiGetDAORoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<Role>> {
        return this.api.getDAORoleWithHttpInfo(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Get a specific role for a DAO
     * @param param the request object
     */
    public getDAORole(param: DaosApiGetDAORoleRequest, options?: ConfigurationOptions): Promise<Role> {
        return this.api.getDAORole(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Get all roles for a DAO
     * @param param the request object
     */
    public getDAORolesWithHttpInfo(param: DaosApiGetDAORolesRequest, options?: ConfigurationOptions): Promise<HttpInfo<RoleListResponse>> {
        return this.api.getDAORolesWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all roles for a DAO
     * @param param the request object
     */
    public getDAORoles(param: DaosApiGetDAORolesRequest, options?: ConfigurationOptions): Promise<RoleListResponse> {
        return this.api.getDAORoles(param.daoId,  options).toPromise();
    }

    /**
     * Get all available governance models
     * @param param the request object
     */
    public getGovernanceModelsWithHttpInfo(param: DaosApiGetGovernanceModelsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<GovernanceModelsList>> {
        return this.api.getGovernanceModelsWithHttpInfo( options).toPromise();
    }

    /**
     * Get all available governance models
     * @param param the request object
     */
    public getGovernanceModels(param: DaosApiGetGovernanceModelsRequest = {}, options?: ConfigurationOptions): Promise<GovernanceModelsList> {
        return this.api.getGovernanceModels( options).toPromise();
    }

    /**
     * Get a POD by ID
     * @param param the request object
     */
    public getPODByIdWithHttpInfo(param: DaosApiGetPODByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<POD>> {
        return this.api.getPODByIdWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get a POD by ID
     * @param param the request object
     */
    public getPODById(param: DaosApiGetPODByIdRequest, options?: ConfigurationOptions): Promise<POD> {
        return this.api.getPODById(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all Discord channels for a POD
     * @param param the request object
     */
    public getPODDiscordChannelsWithHttpInfo(param: DaosApiGetPODDiscordChannelsRequest, options?: ConfigurationOptions): Promise<HttpInfo<DiscordChannelsResponse>> {
        return this.api.getPODDiscordChannelsWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all Discord channels for a POD
     * @param param the request object
     */
    public getPODDiscordChannels(param: DaosApiGetPODDiscordChannelsRequest, options?: ConfigurationOptions): Promise<DiscordChannelsResponse> {
        return this.api.getPODDiscordChannels(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get Discord feed for a POD
     * @param param the request object
     */
    public getPODFeedWithHttpInfo(param: DaosApiGetPODFeedRequest, options?: ConfigurationOptions): Promise<HttpInfo<DiscordMessagesResponse>> {
        return this.api.getPODFeedWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get Discord feed for a POD
     * @param param the request object
     */
    public getPODFeed(param: DaosApiGetPODFeedRequest, options?: ConfigurationOptions): Promise<DiscordMessagesResponse> {
        return this.api.getPODFeed(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all permissions for a specific role in a DAO
     * @param param the request object
     */
    public getRolePermissionsWithHttpInfo(param: DaosApiGetRolePermissionsRequest, options?: ConfigurationOptions): Promise<HttpInfo<PermissionListResponse>> {
        return this.api.getRolePermissionsWithHttpInfo(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Get all permissions for a specific role in a DAO
     * @param param the request object
     */
    public getRolePermissions(param: DaosApiGetRolePermissionsRequest, options?: ConfigurationOptions): Promise<PermissionListResponse> {
        return this.api.getRolePermissions(param.daoId, param.roleId,  options).toPromise();
    }

    /**
     * Get all permissions a user has in a DAO
     * @param param the request object
     */
    public getUserPermissionsWithHttpInfo(param: DaosApiGetUserPermissionsRequest, options?: ConfigurationOptions): Promise<HttpInfo<PermissionListResponse>> {
        return this.api.getUserPermissionsWithHttpInfo(param.daoId, param.userId,  options).toPromise();
    }

    /**
     * Get all permissions a user has in a DAO
     * @param param the request object
     */
    public getUserPermissions(param: DaosApiGetUserPermissionsRequest, options?: ConfigurationOptions): Promise<PermissionListResponse> {
        return this.api.getUserPermissions(param.daoId, param.userId,  options).toPromise();
    }

    /**
     * Get roles for a specific user in a DAO
     * @param param the request object
     */
    public getUserRolesWithHttpInfo(param: DaosApiGetUserRolesRequest, options?: ConfigurationOptions): Promise<HttpInfo<RoleListResponse>> {
        return this.api.getUserRolesWithHttpInfo(param.daoId, param.userId,  options).toPromise();
    }

    /**
     * Get roles for a specific user in a DAO
     * @param param the request object
     */
    public getUserRoles(param: DaosApiGetUserRolesRequest, options?: ConfigurationOptions): Promise<RoleListResponse> {
        return this.api.getUserRoles(param.daoId, param.userId,  options).toPromise();
    }

    /**
     * Initialize DAO creation (Step 1) - Store pubkey and transaction in Redis
     * @param param the request object
     */
    public initializeDAOCreationWithHttpInfo(param: DaosApiInitializeDAOCreationRequest, options?: ConfigurationOptions): Promise<HttpInfo<InitDAOResponse>> {
        return this.api.initializeDAOCreationWithHttpInfo(param.inputInitDAO,  options).toPromise();
    }

    /**
     * Initialize DAO creation (Step 1) - Store pubkey and transaction in Redis
     * @param param the request object
     */
    public initializeDAOCreation(param: DaosApiInitializeDAOCreationRequest, options?: ConfigurationOptions): Promise<InitDAOResponse> {
        return this.api.initializeDAOCreation(param.inputInitDAO,  options).toPromise();
    }

    /**
     * Initialize governance model for a DAO
     * @param param the request object
     */
    public initializeDAOGovernanceWithHttpInfo(param: DaosApiInitializeDAOGovernanceRequest, options?: ConfigurationOptions): Promise<HttpInfo<GovernanceResponse>> {
        return this.api.initializeDAOGovernanceWithHttpInfo(param.daoId, param.inputCreateGovernance,  options).toPromise();
    }

    /**
     * Initialize governance model for a DAO
     * @param param the request object
     */
    public initializeDAOGovernance(param: DaosApiInitializeDAOGovernanceRequest, options?: ConfigurationOptions): Promise<GovernanceResponse> {
        return this.api.initializeDAOGovernance(param.daoId, param.inputCreateGovernance,  options).toPromise();
    }

    /**
     * Create an invitation to join a DAO
     * @param param the request object
     */
    public inviteUserToDAOWithHttpInfo(param: DaosApiInviteUserToDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOInvitationResponse>> {
        return this.api.inviteUserToDAOWithHttpInfo(param.daoId, param.dAOInvitation,  options).toPromise();
    }

    /**
     * Create an invitation to join a DAO
     * @param param the request object
     */
    public inviteUserToDAO(param: DaosApiInviteUserToDAORequest, options?: ConfigurationOptions): Promise<DAOInvitationResponse> {
        return this.api.inviteUserToDAO(param.daoId, param.dAOInvitation,  options).toPromise();
    }

    /**
     * Link a Discord channel to a POD
     * @param param the request object
     */
    public linkDiscordChannelToPODWithHttpInfo(param: DaosApiLinkDiscordChannelToPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<DiscordChannelResponse>> {
        return this.api.linkDiscordChannelToPODWithHttpInfo(param.daoId, param.podId, param.linkDiscordChannel,  options).toPromise();
    }

    /**
     * Link a Discord channel to a POD
     * @param param the request object
     */
    public linkDiscordChannelToPOD(param: DaosApiLinkDiscordChannelToPODRequest, options?: ConfigurationOptions): Promise<DiscordChannelResponse> {
        return this.api.linkDiscordChannelToPOD(param.daoId, param.podId, param.linkDiscordChannel,  options).toPromise();
    }

    /**
     * Remove an admin from a DAO
     * @param param the request object
     */
    public removeAdminFromDAOWithHttpInfo(param: DaosApiRemoveAdminFromDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOMembershipResponse>> {
        return this.api.removeAdminFromDAOWithHttpInfo(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Remove an admin from a DAO
     * @param param the request object
     */
    public removeAdminFromDAO(param: DaosApiRemoveAdminFromDAORequest, options?: ConfigurationOptions): Promise<DAOMembershipResponse> {
        return this.api.removeAdminFromDAO(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Remove a module from a DAO
     * @param param the request object
     */
    public removeDAOModuleWithHttpInfo(param: DaosApiRemoveDAOModuleRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOModuleResponse>> {
        return this.api.removeDAOModuleWithHttpInfo(param.daoId, param.dAOModule,  options).toPromise();
    }

    /**
     * Remove a module from a DAO
     * @param param the request object
     */
    public removeDAOModule(param: DaosApiRemoveDAOModuleRequest, options?: ConfigurationOptions): Promise<DAOModuleResponse> {
        return this.api.removeDAOModule(param.daoId, param.dAOModule,  options).toPromise();
    }

    /**
     * Remove a member from a DAO
     * @param param the request object
     */
    public removeMemberFromDAOWithHttpInfo(param: DaosApiRemoveMemberFromDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOMembershipResponse>> {
        return this.api.removeMemberFromDAOWithHttpInfo(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Remove a member from a DAO
     * @param param the request object
     */
    public removeMemberFromDAO(param: DaosApiRemoveMemberFromDAORequest, options?: ConfigurationOptions): Promise<DAOMembershipResponse> {
        return this.api.removeMemberFromDAO(param.daoId, param.dAOMembership,  options).toPromise();
    }

    /**
     * Remove a member from a POD
     * @param param the request object
     */
    public removeMemberFromPODWithHttpInfo(param: DaosApiRemoveMemberFromPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PODMembershipResponse>> {
        return this.api.removeMemberFromPODWithHttpInfo(param.daoId, param.podId, param.pODMembership,  options).toPromise();
    }

    /**
     * Remove a member from a POD
     * @param param the request object
     */
    public removeMemberFromPOD(param: DaosApiRemoveMemberFromPODRequest, options?: ConfigurationOptions): Promise<PODMembershipResponse> {
        return this.api.removeMemberFromPOD(param.daoId, param.podId, param.pODMembership,  options).toPromise();
    }

    /**
     * Remove a permission from a role in a DAO
     * @param param the request object
     */
    public removePermissionFromRoleWithHttpInfo(param: DaosApiRemovePermissionFromRoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<RolePermissionResponse>> {
        return this.api.removePermissionFromRoleWithHttpInfo(param.daoId, param.roleId, param.permissionId,  options).toPromise();
    }

    /**
     * Remove a permission from a role in a DAO
     * @param param the request object
     */
    public removePermissionFromRole(param: DaosApiRemovePermissionFromRoleRequest, options?: ConfigurationOptions): Promise<RolePermissionResponse> {
        return this.api.removePermissionFromRole(param.daoId, param.roleId, param.permissionId,  options).toPromise();
    }

    /**
     * Remove a role from a user in a DAO
     * @param param the request object
     */
    public removeRoleFromUserWithHttpInfo(param: DaosApiRemoveRoleFromUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserRoleResponse>> {
        return this.api.removeRoleFromUserWithHttpInfo(param.daoId, param.userId, param.roleId,  options).toPromise();
    }

    /**
     * Remove a role from a user in a DAO
     * @param param the request object
     */
    public removeRoleFromUser(param: DaosApiRemoveRoleFromUserRequest, options?: ConfigurationOptions): Promise<UserRoleResponse> {
        return this.api.removeRoleFromUser(param.daoId, param.userId, param.roleId,  options).toPromise();
    }

    /**
     * Respond to a DAO application (accept/reject)
     * @param param the request object
     */
    public respondToDAOApplicationWithHttpInfo(param: DaosApiRespondToDAOApplicationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOApplicationResponse>> {
        return this.api.respondToDAOApplicationWithHttpInfo(param.daoId, param.applicationId, param.dAOApplicationAction,  options).toPromise();
    }

    /**
     * Respond to a DAO application (accept/reject)
     * @param param the request object
     */
    public respondToDAOApplication(param: DaosApiRespondToDAOApplicationRequest, options?: ConfigurationOptions): Promise<DAOApplicationResponse> {
        return this.api.respondToDAOApplication(param.daoId, param.applicationId, param.dAOApplicationAction,  options).toPromise();
    }

    /**
     * Respond to a DAO invitation (accept/decline)
     * @param param the request object
     */
    public respondToDAOInvitationWithHttpInfo(param: DaosApiRespondToDAOInvitationRequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOInvitationResponse>> {
        return this.api.respondToDAOInvitationWithHttpInfo(param.daoId, param.invitationId, param.dAOInvitationAction,  options).toPromise();
    }

    /**
     * Respond to a DAO invitation (accept/decline)
     * @param param the request object
     */
    public respondToDAOInvitation(param: DaosApiRespondToDAOInvitationRequest, options?: ConfigurationOptions): Promise<DAOInvitationResponse> {
        return this.api.respondToDAOInvitation(param.daoId, param.invitationId, param.dAOInvitationAction,  options).toPromise();
    }

    /**
     * Unlink a Discord channel from a POD
     * @param param the request object
     */
    public unlinkDiscordChannelFromPODWithHttpInfo(param: DaosApiUnlinkDiscordChannelFromPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<DiscordChannelResponse>> {
        return this.api.unlinkDiscordChannelFromPODWithHttpInfo(param.daoId, param.podId, param.channelId,  options).toPromise();
    }

    /**
     * Unlink a Discord channel from a POD
     * @param param the request object
     */
    public unlinkDiscordChannelFromPOD(param: DaosApiUnlinkDiscordChannelFromPODRequest, options?: ConfigurationOptions): Promise<DiscordChannelResponse> {
        return this.api.unlinkDiscordChannelFromPOD(param.daoId, param.podId, param.channelId,  options).toPromise();
    }

    /**
     * Update a DAO
     * @param param the request object
     */
    public updateDAOWithHttpInfo(param: DaosApiUpdateDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<DAOSchemaResponse>> {
        return this.api.updateDAOWithHttpInfo(param.daoId, param.dAOUpdate,  options).toPromise();
    }

    /**
     * Update a DAO
     * @param param the request object
     */
    public updateDAO(param: DaosApiUpdateDAORequest, options?: ConfigurationOptions): Promise<DAOSchemaResponse> {
        return this.api.updateDAO(param.daoId, param.dAOUpdate,  options).toPromise();
    }

    /**
     * Update governance model for a DAO
     * @param param the request object
     */
    public updateDAOGovernanceWithHttpInfo(param: DaosApiUpdateDAOGovernanceRequest, options?: ConfigurationOptions): Promise<HttpInfo<GovernanceResponse>> {
        return this.api.updateDAOGovernanceWithHttpInfo(param.daoId, param.inputUpdateGovernance,  options).toPromise();
    }

    /**
     * Update governance model for a DAO
     * @param param the request object
     */
    public updateDAOGovernance(param: DaosApiUpdateDAOGovernanceRequest, options?: ConfigurationOptions): Promise<GovernanceResponse> {
        return this.api.updateDAOGovernance(param.daoId, param.inputUpdateGovernance,  options).toPromise();
    }

    /**
     * Update a role for a DAO
     * @param param the request object
     */
    public updateDAORoleWithHttpInfo(param: DaosApiUpdateDAORoleRequest, options?: ConfigurationOptions): Promise<HttpInfo<RoleResponse>> {
        return this.api.updateDAORoleWithHttpInfo(param.daoId, param.roleId, param.inputUpdateRole,  options).toPromise();
    }

    /**
     * Update a role for a DAO
     * @param param the request object
     */
    public updateDAORole(param: DaosApiUpdateDAORoleRequest, options?: ConfigurationOptions): Promise<RoleResponse> {
        return this.api.updateDAORole(param.daoId, param.roleId, param.inputUpdateRole,  options).toPromise();
    }

    /**
     * Update a POD
     * @param param the request object
     */
    public updatePODWithHttpInfo(param: DaosApiUpdatePODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PODSchemaResponse>> {
        return this.api.updatePODWithHttpInfo(param.daoId, param.podId, param.pODUpdate,  options).toPromise();
    }

    /**
     * Update a POD
     * @param param the request object
     */
    public updatePOD(param: DaosApiUpdatePODRequest, options?: ConfigurationOptions): Promise<PODSchemaResponse> {
        return this.api.updatePOD(param.daoId, param.podId, param.pODUpdate,  options).toPromise();
    }

}

import { ObservableDiscordOauthApi } from "./ObservableAPI";
import { DiscordOauthApiRequestFactory, DiscordOauthApiResponseProcessor} from "../apis/DiscordOauthApi";

export interface DiscordOauthApiConnectDiscordRequest {
}

export interface DiscordOauthApiDisconnectDiscordRequest {
}

export interface DiscordOauthApiDiscordCallbackRequest {
}

export class ObjectDiscordOauthApi {
    private api: ObservableDiscordOauthApi

    public constructor(configuration: Configuration, requestFactory?: DiscordOauthApiRequestFactory, responseProcessor?: DiscordOauthApiResponseProcessor) {
        this.api = new ObservableDiscordOauthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Redirects the user to Discord\'s authorization page to begin the OAuth flow.
     * Initiate Discord OAuth flow
     * @param param the request object
     */
    public connectDiscordWithHttpInfo(param: DiscordOauthApiConnectDiscordRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<OAuthResponse>> {
        return this.api.connectDiscordWithHttpInfo( options).toPromise();
    }

    /**
     * Redirects the user to Discord\'s authorization page to begin the OAuth flow.
     * Initiate Discord OAuth flow
     * @param param the request object
     */
    public connectDiscord(param: DiscordOauthApiConnectDiscordRequest = {}, options?: ConfigurationOptions): Promise<OAuthResponse> {
        return this.api.connectDiscord( options).toPromise();
    }

    /**
     * Removes the connection between the user\'s account and their Discord account.
     * Disconnect Discord account
     * @param param the request object
     */
    public disconnectDiscordWithHttpInfo(param: DiscordOauthApiDisconnectDiscordRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<DisconnectResponse>> {
        return this.api.disconnectDiscordWithHttpInfo( options).toPromise();
    }

    /**
     * Removes the connection between the user\'s account and their Discord account.
     * Disconnect Discord account
     * @param param the request object
     */
    public disconnectDiscord(param: DiscordOauthApiDisconnectDiscordRequest = {}, options?: ConfigurationOptions): Promise<DisconnectResponse> {
        return this.api.disconnectDiscord( options).toPromise();
    }

    /**
     * Processes the callback from Discord after user authorization.
     * Handle Discord OAuth callback
     * @param param the request object
     */
    public discordCallbackWithHttpInfo(param: DiscordOauthApiDiscordCallbackRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.discordCallbackWithHttpInfo( options).toPromise();
    }

    /**
     * Processes the callback from Discord after user authorization.
     * Handle Discord OAuth callback
     * @param param the request object
     */
    public discordCallback(param: DiscordOauthApiDiscordCallbackRequest = {}, options?: ConfigurationOptions): Promise<void> {
        return this.api.discordCallback( options).toPromise();
    }

}

import { ObservableProposalsApi } from "./ObservableAPI";
import { ProposalsApiRequestFactory, ProposalsApiResponseProcessor} from "../apis/ProposalsApi";

export interface ProposalsApiCreateProposalForDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApicreateProposalForDAO
     */
    daoId: string
    /**
     * 
     * @type InputCreateProposal
     * @memberof ProposalsApicreateProposalForDAO
     */
    inputCreateProposal: InputCreateProposal
}

export interface ProposalsApiCreateProposalForPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApicreateProposalForPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApicreateProposalForPOD
     */
    podId: string
    /**
     * 
     * @type InputCreateProposal
     * @memberof ProposalsApicreateProposalForPOD
     */
    inputCreateProposal: InputCreateProposal
}

export interface ProposalsApiDeleteDAOProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApideleteDAOProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApideleteDAOProposal
     */
    proposalId: string
}

export interface ProposalsApiDeletePODProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApideletePODProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApideletePODProposal
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApideletePODProposal
     */
    proposalId: string
}

export interface ProposalsApiGetActiveProposalsByDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetActiveProposalsByDAO
     */
    daoId: string
}

export interface ProposalsApiGetActiveProposalsByPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetActiveProposalsByPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetActiveProposalsByPOD
     */
    podId: string
}

export interface ProposalsApiGetDAOProposalByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetDAOProposalById
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetDAOProposalById
     */
    proposalId: string
}

export interface ProposalsApiGetPODProposalByIdRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalById
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalById
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalById
     */
    proposalId: string
}

export interface ProposalsApiGetPODProposalVotesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalVotes
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalVotes
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetPODProposalVotes
     */
    proposalId: string
}

export interface ProposalsApiGetProposalVotesRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetProposalVotes
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetProposalVotes
     */
    proposalId: string
}

export interface ProposalsApiGetProposalsByDAORequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetProposalsByDAO
     */
    daoId: string
}

export interface ProposalsApiGetProposalsByPODRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetProposalsByPOD
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApigetProposalsByPOD
     */
    podId: string
}

export interface ProposalsApiRemoveVoteFromDAOProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiremoveVoteFromDAOProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiremoveVoteFromDAOProposal
     */
    proposalId: string
}

export interface ProposalsApiRemoveVoteFromPODProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiremoveVoteFromPODProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiremoveVoteFromPODProposal
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiremoveVoteFromPODProposal
     */
    proposalId: string
}

export interface ProposalsApiUpdateDAOProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiupdateDAOProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiupdateDAOProposal
     */
    proposalId: string
    /**
     * 
     * @type ProposalUpdate
     * @memberof ProposalsApiupdateDAOProposal
     */
    proposalUpdate: ProposalUpdate
}

export interface ProposalsApiUpdatePODProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiupdatePODProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiupdatePODProposal
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApiupdatePODProposal
     */
    proposalId: string
    /**
     * 
     * @type ProposalUpdate
     * @memberof ProposalsApiupdatePODProposal
     */
    proposalUpdate: ProposalUpdate
}

export interface ProposalsApiVoteOnDAOProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApivoteOnDAOProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApivoteOnDAOProposal
     */
    proposalId: string
    /**
     * 
     * @type ProposalVote
     * @memberof ProposalsApivoteOnDAOProposal
     */
    proposalVote: ProposalVote
}

export interface ProposalsApiVoteOnPODProposalRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApivoteOnPODProposal
     */
    daoId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApivoteOnPODProposal
     */
    podId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProposalsApivoteOnPODProposal
     */
    proposalId: string
    /**
     * 
     * @type ProposalVote
     * @memberof ProposalsApivoteOnPODProposal
     */
    proposalVote: ProposalVote
}

export class ObjectProposalsApi {
    private api: ObservableProposalsApi

    public constructor(configuration: Configuration, requestFactory?: ProposalsApiRequestFactory, responseProcessor?: ProposalsApiResponseProcessor) {
        this.api = new ObservableProposalsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create a new proposal for this specific DAO
     * @param param the request object
     */
    public createProposalForDAOWithHttpInfo(param: ProposalsApiCreateProposalForDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.createProposalForDAOWithHttpInfo(param.daoId, param.inputCreateProposal,  options).toPromise();
    }

    /**
     * Create a new proposal for this specific DAO
     * @param param the request object
     */
    public createProposalForDAO(param: ProposalsApiCreateProposalForDAORequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.createProposalForDAO(param.daoId, param.inputCreateProposal,  options).toPromise();
    }

    /**
     * Create a new proposal for this specific POD
     * @param param the request object
     */
    public createProposalForPODWithHttpInfo(param: ProposalsApiCreateProposalForPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.createProposalForPODWithHttpInfo(param.daoId, param.podId, param.inputCreateProposal,  options).toPromise();
    }

    /**
     * Create a new proposal for this specific POD
     * @param param the request object
     */
    public createProposalForPOD(param: ProposalsApiCreateProposalForPODRequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.createProposalForPOD(param.daoId, param.podId, param.inputCreateProposal,  options).toPromise();
    }

    /**
     * Delete a proposal for a DAO
     * @param param the request object
     */
    public deleteDAOProposalWithHttpInfo(param: ProposalsApiDeleteDAOProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.deleteDAOProposalWithHttpInfo(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Delete a proposal for a DAO
     * @param param the request object
     */
    public deleteDAOProposal(param: ProposalsApiDeleteDAOProposalRequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.deleteDAOProposal(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Delete a proposal for a POD
     * @param param the request object
     */
    public deletePODProposalWithHttpInfo(param: ProposalsApiDeletePODProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.deletePODProposalWithHttpInfo(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Delete a proposal for a POD
     * @param param the request object
     */
    public deletePODProposal(param: ProposalsApiDeletePODProposalRequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.deletePODProposal(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Get all active proposals for a specific DAO
     * @param param the request object
     */
    public getActiveProposalsByDAOWithHttpInfo(param: ProposalsApiGetActiveProposalsByDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<Proposal>>> {
        return this.api.getActiveProposalsByDAOWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all active proposals for a specific DAO
     * @param param the request object
     */
    public getActiveProposalsByDAO(param: ProposalsApiGetActiveProposalsByDAORequest, options?: ConfigurationOptions): Promise<Array<Proposal>> {
        return this.api.getActiveProposalsByDAO(param.daoId,  options).toPromise();
    }

    /**
     * Get all active proposals for a specific POD
     * @param param the request object
     */
    public getActiveProposalsByPODWithHttpInfo(param: ProposalsApiGetActiveProposalsByPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PodProposalListResponse>> {
        return this.api.getActiveProposalsByPODWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all active proposals for a specific POD
     * @param param the request object
     */
    public getActiveProposalsByPOD(param: ProposalsApiGetActiveProposalsByPODRequest, options?: ConfigurationOptions): Promise<PodProposalListResponse> {
        return this.api.getActiveProposalsByPOD(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get a specific proposal for a DAO
     * @param param the request object
     */
    public getDAOProposalByIdWithHttpInfo(param: ProposalsApiGetDAOProposalByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Proposal>> {
        return this.api.getDAOProposalByIdWithHttpInfo(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Get a specific proposal for a DAO
     * @param param the request object
     */
    public getDAOProposalById(param: ProposalsApiGetDAOProposalByIdRequest, options?: ConfigurationOptions): Promise<Proposal> {
        return this.api.getDAOProposalById(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Get a specific proposal for a POD
     * @param param the request object
     */
    public getPODProposalByIdWithHttpInfo(param: ProposalsApiGetPODProposalByIdRequest, options?: ConfigurationOptions): Promise<HttpInfo<Proposal>> {
        return this.api.getPODProposalByIdWithHttpInfo(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Get a specific proposal for a POD
     * @param param the request object
     */
    public getPODProposalById(param: ProposalsApiGetPODProposalByIdRequest, options?: ConfigurationOptions): Promise<Proposal> {
        return this.api.getPODProposalById(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Get vote counts for a POD proposal
     * @param param the request object
     */
    public getPODProposalVotesWithHttpInfo(param: ProposalsApiGetPODProposalVotesRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.getPODProposalVotesWithHttpInfo(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Get vote counts for a POD proposal
     * @param param the request object
     */
    public getPODProposalVotes(param: ProposalsApiGetPODProposalVotesRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.getPODProposalVotes(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Get vote counts for a proposal
     * @param param the request object
     */
    public getProposalVotesWithHttpInfo(param: ProposalsApiGetProposalVotesRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.getProposalVotesWithHttpInfo(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Get vote counts for a proposal
     * @param param the request object
     */
    public getProposalVotes(param: ProposalsApiGetProposalVotesRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.getProposalVotes(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Get all proposals for a specific DAO
     * @param param the request object
     */
    public getProposalsByDAOWithHttpInfo(param: ProposalsApiGetProposalsByDAORequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<Proposal>>> {
        return this.api.getProposalsByDAOWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all proposals for a specific DAO
     * @param param the request object
     */
    public getProposalsByDAO(param: ProposalsApiGetProposalsByDAORequest, options?: ConfigurationOptions): Promise<Array<Proposal>> {
        return this.api.getProposalsByDAO(param.daoId,  options).toPromise();
    }

    /**
     * Get all proposals for a specific POD
     * @param param the request object
     */
    public getProposalsByPODWithHttpInfo(param: ProposalsApiGetProposalsByPODRequest, options?: ConfigurationOptions): Promise<HttpInfo<PodProposalListResponse>> {
        return this.api.getProposalsByPODWithHttpInfo(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Get all proposals for a specific POD
     * @param param the request object
     */
    public getProposalsByPOD(param: ProposalsApiGetProposalsByPODRequest, options?: ConfigurationOptions): Promise<PodProposalListResponse> {
        return this.api.getProposalsByPOD(param.daoId, param.podId,  options).toPromise();
    }

    /**
     * Remove a user\'s vote from a proposal
     * @param param the request object
     */
    public removeVoteFromDAOProposalWithHttpInfo(param: ProposalsApiRemoveVoteFromDAOProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.removeVoteFromDAOProposalWithHttpInfo(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Remove a user\'s vote from a proposal
     * @param param the request object
     */
    public removeVoteFromDAOProposal(param: ProposalsApiRemoveVoteFromDAOProposalRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.removeVoteFromDAOProposal(param.daoId, param.proposalId,  options).toPromise();
    }

    /**
     * Remove a vote from a POD proposal
     * @param param the request object
     */
    public removeVoteFromPODProposalWithHttpInfo(param: ProposalsApiRemoveVoteFromPODProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.removeVoteFromPODProposalWithHttpInfo(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Remove a vote from a POD proposal
     * @param param the request object
     */
    public removeVoteFromPODProposal(param: ProposalsApiRemoveVoteFromPODProposalRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.removeVoteFromPODProposal(param.daoId, param.podId, param.proposalId,  options).toPromise();
    }

    /**
     * Update a proposal for a DAO
     * @param param the request object
     */
    public updateDAOProposalWithHttpInfo(param: ProposalsApiUpdateDAOProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.updateDAOProposalWithHttpInfo(param.daoId, param.proposalId, param.proposalUpdate,  options).toPromise();
    }

    /**
     * Update a proposal for a DAO
     * @param param the request object
     */
    public updateDAOProposal(param: ProposalsApiUpdateDAOProposalRequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.updateDAOProposal(param.daoId, param.proposalId, param.proposalUpdate,  options).toPromise();
    }

    /**
     * Update a proposal for a POD
     * @param param the request object
     */
    public updatePODProposalWithHttpInfo(param: ProposalsApiUpdatePODProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalSchemaResponse>> {
        return this.api.updatePODProposalWithHttpInfo(param.daoId, param.podId, param.proposalId, param.proposalUpdate,  options).toPromise();
    }

    /**
     * Update a proposal for a POD
     * @param param the request object
     */
    public updatePODProposal(param: ProposalsApiUpdatePODProposalRequest, options?: ConfigurationOptions): Promise<ProposalSchemaResponse> {
        return this.api.updatePODProposal(param.daoId, param.podId, param.proposalId, param.proposalUpdate,  options).toPromise();
    }

    /**
     * Vote on a proposal for a DAO
     * @param param the request object
     */
    public voteOnDAOProposalWithHttpInfo(param: ProposalsApiVoteOnDAOProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.voteOnDAOProposalWithHttpInfo(param.daoId, param.proposalId, param.proposalVote,  options).toPromise();
    }

    /**
     * Vote on a proposal for a DAO
     * @param param the request object
     */
    public voteOnDAOProposal(param: ProposalsApiVoteOnDAOProposalRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.voteOnDAOProposal(param.daoId, param.proposalId, param.proposalVote,  options).toPromise();
    }

    /**
     * Vote on a POD proposal
     * @param param the request object
     */
    public voteOnPODProposalWithHttpInfo(param: ProposalsApiVoteOnPODProposalRequest, options?: ConfigurationOptions): Promise<HttpInfo<ProposalVoteResponse>> {
        return this.api.voteOnPODProposalWithHttpInfo(param.daoId, param.podId, param.proposalId, param.proposalVote,  options).toPromise();
    }

    /**
     * Vote on a POD proposal
     * @param param the request object
     */
    public voteOnPODProposal(param: ProposalsApiVoteOnPODProposalRequest, options?: ConfigurationOptions): Promise<ProposalVoteResponse> {
        return this.api.voteOnPODProposal(param.daoId, param.podId, param.proposalId, param.proposalVote,  options).toPromise();
    }

}

import { ObservableSocialConnectionsApi } from "./ObservableAPI";
import { SocialConnectionsApiRequestFactory, SocialConnectionsApiResponseProcessor} from "../apis/SocialConnectionsApi";

export interface SocialConnectionsApiGetSocialConnectionsRequest {
}

export class ObjectSocialConnectionsApi {
    private api: ObservableSocialConnectionsApi

    public constructor(configuration: Configuration, requestFactory?: SocialConnectionsApiRequestFactory, responseProcessor?: SocialConnectionsApiResponseProcessor) {
        this.api = new ObservableSocialConnectionsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Returns all social connections for the authenticated user.
     * Get user\'s social connections
     * @param param the request object
     */
    public getSocialConnectionsWithHttpInfo(param: SocialConnectionsApiGetSocialConnectionsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ConnectionsList>> {
        return this.api.getSocialConnectionsWithHttpInfo( options).toPromise();
    }

    /**
     * Returns all social connections for the authenticated user.
     * Get user\'s social connections
     * @param param the request object
     */
    public getSocialConnections(param: SocialConnectionsApiGetSocialConnectionsRequest = {}, options?: ConfigurationOptions): Promise<ConnectionsList> {
        return this.api.getSocialConnections( options).toPromise();
    }

}

import { ObservableTelegramAuthApi } from "./ObservableAPI";
import { TelegramAuthApiRequestFactory, TelegramAuthApiResponseProcessor} from "../apis/TelegramAuthApi";

export interface TelegramAuthApiDisconnectTelegramRequest {
}

export interface TelegramAuthApiTelegramCallbackRequest {
    /**
     * 
     * @type TelegramAuth
     * @memberof TelegramAuthApitelegramCallback
     */
    telegramAuth: TelegramAuth
}

export class ObjectTelegramAuthApi {
    private api: ObservableTelegramAuthApi

    public constructor(configuration: Configuration, requestFactory?: TelegramAuthApiRequestFactory, responseProcessor?: TelegramAuthApiResponseProcessor) {
        this.api = new ObservableTelegramAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Removes the connection between the user\'s account and their Telegram account.
     * Disconnect Telegram account
     * @param param the request object
     */
    public disconnectTelegramWithHttpInfo(param: TelegramAuthApiDisconnectTelegramRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<DisconnectResponse>> {
        return this.api.disconnectTelegramWithHttpInfo( options).toPromise();
    }

    /**
     * Removes the connection between the user\'s account and their Telegram account.
     * Disconnect Telegram account
     * @param param the request object
     */
    public disconnectTelegram(param: TelegramAuthApiDisconnectTelegramRequest = {}, options?: ConfigurationOptions): Promise<DisconnectResponse> {
        return this.api.disconnectTelegram( options).toPromise();
    }

    /**
     * Handles the authentication data from the Telegram Login Widget.
     * Process Telegram authentication data
     * @param param the request object
     */
    public telegramCallbackWithHttpInfo(param: TelegramAuthApiTelegramCallbackRequest, options?: ConfigurationOptions): Promise<HttpInfo<ConnectionResponse>> {
        return this.api.telegramCallbackWithHttpInfo(param.telegramAuth,  options).toPromise();
    }

    /**
     * Handles the authentication data from the Telegram Login Widget.
     * Process Telegram authentication data
     * @param param the request object
     */
    public telegramCallback(param: TelegramAuthApiTelegramCallbackRequest, options?: ConfigurationOptions): Promise<ConnectionResponse> {
        return this.api.telegramCallback(param.telegramAuth,  options).toPromise();
    }

}

import { ObservableTreasuryApi } from "./ObservableAPI";
import { TreasuryApiRequestFactory, TreasuryApiResponseProcessor} from "../apis/TreasuryApi";

export interface TreasuryApiCreateDAOTransferRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof TreasuryApicreateDAOTransfer
     */
    daoId: string
    /**
     * 
     * @type TransferCreate
     * @memberof TreasuryApicreateDAOTransfer
     */
    transferCreate: TransferCreate
}

export interface TreasuryApiGetDAOTokensRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof TreasuryApigetDAOTokens
     */
    daoId: string
}

export interface TreasuryApiGetDAOTransfersRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof TreasuryApigetDAOTransfers
     */
    daoId: string
}

export interface TreasuryApiGetDAOTreasuryRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof TreasuryApigetDAOTreasury
     */
    daoId: string
}

export class ObjectTreasuryApi {
    private api: ObservableTreasuryApi

    public constructor(configuration: Configuration, requestFactory?: TreasuryApiRequestFactory, responseProcessor?: TreasuryApiResponseProcessor) {
        this.api = new ObservableTreasuryApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create a new transfer for a specific DAO
     * @param param the request object
     */
    public createDAOTransferWithHttpInfo(param: TreasuryApiCreateDAOTransferRequest, options?: ConfigurationOptions): Promise<HttpInfo<TransferSchemaResponse>> {
        return this.api.createDAOTransferWithHttpInfo(param.daoId, param.transferCreate,  options).toPromise();
    }

    /**
     * Create a new transfer for a specific DAO
     * @param param the request object
     */
    public createDAOTransfer(param: TreasuryApiCreateDAOTransferRequest, options?: ConfigurationOptions): Promise<TransferSchemaResponse> {
        return this.api.createDAOTransfer(param.daoId, param.transferCreate,  options).toPromise();
    }

    /**
     * Get all tokens for a specific DAO
     * @param param the request object
     */
    public getDAOTokensWithHttpInfo(param: TreasuryApiGetDAOTokensRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<Token>>> {
        return this.api.getDAOTokensWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all tokens for a specific DAO
     * @param param the request object
     */
    public getDAOTokens(param: TreasuryApiGetDAOTokensRequest, options?: ConfigurationOptions): Promise<Array<Token>> {
        return this.api.getDAOTokens(param.daoId,  options).toPromise();
    }

    /**
     * Get all transfers for a specific DAO
     * @param param the request object
     */
    public getDAOTransfersWithHttpInfo(param: TreasuryApiGetDAOTransfersRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<Transfer>>> {
        return this.api.getDAOTransfersWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get all transfers for a specific DAO
     * @param param the request object
     */
    public getDAOTransfers(param: TreasuryApiGetDAOTransfersRequest, options?: ConfigurationOptions): Promise<Array<Transfer>> {
        return this.api.getDAOTransfers(param.daoId,  options).toPromise();
    }

    /**
     * Get Treasury information for a specific DAO
     * @param param the request object
     */
    public getDAOTreasuryWithHttpInfo(param: TreasuryApiGetDAOTreasuryRequest, options?: ConfigurationOptions): Promise<HttpInfo<Treasury>> {
        return this.api.getDAOTreasuryWithHttpInfo(param.daoId,  options).toPromise();
    }

    /**
     * Get Treasury information for a specific DAO
     * @param param the request object
     */
    public getDAOTreasury(param: TreasuryApiGetDAOTreasuryRequest, options?: ConfigurationOptions): Promise<Treasury> {
        return this.api.getDAOTreasury(param.daoId,  options).toPromise();
    }

}

import { ObservableTwitterOauthApi } from "./ObservableAPI";
import { TwitterOauthApiRequestFactory, TwitterOauthApiResponseProcessor} from "../apis/TwitterOauthApi";

export interface TwitterOauthApiConnectTwitterRequest {
}

export interface TwitterOauthApiDisconnectTwitterRequest {
}

export interface TwitterOauthApiTwitterCallbackRequest {
}

export class ObjectTwitterOauthApi {
    private api: ObservableTwitterOauthApi

    public constructor(configuration: Configuration, requestFactory?: TwitterOauthApiRequestFactory, responseProcessor?: TwitterOauthApiResponseProcessor) {
        this.api = new ObservableTwitterOauthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Redirects the user to Twitter\'s authorization page to begin the OAuth 2.0 PKCE flow.
     * Initiate Twitter OAuth flow
     * @param param the request object
     */
    public connectTwitterWithHttpInfo(param: TwitterOauthApiConnectTwitterRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<OAuthResponse>> {
        return this.api.connectTwitterWithHttpInfo( options).toPromise();
    }

    /**
     * Redirects the user to Twitter\'s authorization page to begin the OAuth 2.0 PKCE flow.
     * Initiate Twitter OAuth flow
     * @param param the request object
     */
    public connectTwitter(param: TwitterOauthApiConnectTwitterRequest = {}, options?: ConfigurationOptions): Promise<OAuthResponse> {
        return this.api.connectTwitter( options).toPromise();
    }

    /**
     * Removes the connection between the user\'s account and their Twitter account.
     * Disconnect Twitter account
     * @param param the request object
     */
    public disconnectTwitterWithHttpInfo(param: TwitterOauthApiDisconnectTwitterRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<DisconnectResponse>> {
        return this.api.disconnectTwitterWithHttpInfo( options).toPromise();
    }

    /**
     * Removes the connection between the user\'s account and their Twitter account.
     * Disconnect Twitter account
     * @param param the request object
     */
    public disconnectTwitter(param: TwitterOauthApiDisconnectTwitterRequest = {}, options?: ConfigurationOptions): Promise<DisconnectResponse> {
        return this.api.disconnectTwitter( options).toPromise();
    }

    /**
     * Processes the callback from Twitter after user authorization.
     * Handle Twitter OAuth callback
     * @param param the request object
     */
    public twitterCallbackWithHttpInfo(param: TwitterOauthApiTwitterCallbackRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.twitterCallbackWithHttpInfo( options).toPromise();
    }

    /**
     * Processes the callback from Twitter after user authorization.
     * Handle Twitter OAuth callback
     * @param param the request object
     */
    public twitterCallback(param: TwitterOauthApiTwitterCallbackRequest = {}, options?: ConfigurationOptions): Promise<void> {
        return this.api.twitterCallback( options).toPromise();
    }

}

import { ObservableUsersApi } from "./ObservableAPI";
import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";

export interface UsersApiCreateUserRequest {
    /**
     * 
     * @type InputCreateUser
     * @memberof UsersApicreateUser
     */
    inputCreateUser: InputCreateUser
}

export interface UsersApiGetAuthUserInfosRequest {
}

export interface UsersApiGetUserApplicationsRequest {
}

export interface UsersApiGetUserInvitationsRequest {
}

export interface UsersApiGetUserWithWalletAddressRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof UsersApigetUserWithWalletAddress
     */
    walletAddress: string
}

export interface UsersApiSearchUsersRequest {
    /**
     * Username to search for
     * Defaults to: undefined
     * @type string
     * @memberof UsersApisearchUsers
     */
    username: string
}

export interface UsersApiUpdateUserRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof UsersApiupdateUser
     */
    userId: string
    /**
     * 
     * @type InputUpdateUser
     * @memberof UsersApiupdateUser
     */
    inputUpdateUser: InputUpdateUser
}

export class ObjectUsersApi {
    private api: ObservableUsersApi

    public constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create a new user
     * @param param the request object
     */
    public createUserWithHttpInfo(param: UsersApiCreateUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserResponse>> {
        return this.api.createUserWithHttpInfo(param.inputCreateUser,  options).toPromise();
    }

    /**
     * Create a new user
     * @param param the request object
     */
    public createUser(param: UsersApiCreateUserRequest, options?: ConfigurationOptions): Promise<UserResponse> {
        return this.api.createUser(param.inputCreateUser,  options).toPromise();
    }

    /**
     * Get authenticated user informations
     * @param param the request object
     */
    public getAuthUserInfosWithHttpInfo(param: UsersApiGetAuthUserInfosRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.getAuthUserInfosWithHttpInfo( options).toPromise();
    }

    /**
     * Get authenticated user informations
     * @param param the request object
     */
    public getAuthUserInfos(param: UsersApiGetAuthUserInfosRequest = {}, options?: ConfigurationOptions): Promise<User> {
        return this.api.getAuthUserInfos( options).toPromise();
    }

    /**
     * Get all applications submitted by the authenticated user
     * @param param the request object
     */
    public getUserApplicationsWithHttpInfo(param: UsersApiGetUserApplicationsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<UserApplicationResponse>> {
        return this.api.getUserApplicationsWithHttpInfo( options).toPromise();
    }

    /**
     * Get all applications submitted by the authenticated user
     * @param param the request object
     */
    public getUserApplications(param: UsersApiGetUserApplicationsRequest = {}, options?: ConfigurationOptions): Promise<UserApplicationResponse> {
        return this.api.getUserApplications( options).toPromise();
    }

    /**
     * Get all invitations for the authenticated user
     * @param param the request object
     */
    public getUserInvitationsWithHttpInfo(param: UsersApiGetUserInvitationsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<UserInvitationsResponse>> {
        return this.api.getUserInvitationsWithHttpInfo( options).toPromise();
    }

    /**
     * Get all invitations for the authenticated user
     * @param param the request object
     */
    public getUserInvitations(param: UsersApiGetUserInvitationsRequest = {}, options?: ConfigurationOptions): Promise<UserInvitationsResponse> {
        return this.api.getUserInvitations( options).toPromise();
    }

    /**
     * Check if user with the wallet address exists
     * @param param the request object
     */
    public getUserWithWalletAddressWithHttpInfo(param: UsersApiGetUserWithWalletAddressRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserExistResponse>> {
        return this.api.getUserWithWalletAddressWithHttpInfo(param.walletAddress,  options).toPromise();
    }

    /**
     * Check if user with the wallet address exists
     * @param param the request object
     */
    public getUserWithWalletAddress(param: UsersApiGetUserWithWalletAddressRequest, options?: ConfigurationOptions): Promise<UserExistResponse> {
        return this.api.getUserWithWalletAddress(param.walletAddress,  options).toPromise();
    }

    /**
     * Search for users by username to invite to a DAO
     * @param param the request object
     */
    public searchUsersWithHttpInfo(param: UsersApiSearchUsersRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserSearchResponse>> {
        return this.api.searchUsersWithHttpInfo(param.username,  options).toPromise();
    }

    /**
     * Search for users by username to invite to a DAO
     * @param param the request object
     */
    public searchUsers(param: UsersApiSearchUsersRequest, options?: ConfigurationOptions): Promise<UserSearchResponse> {
        return this.api.searchUsers(param.username,  options).toPromise();
    }

    /**
     * Update an existing user
     * @param param the request object
     */
    public updateUserWithHttpInfo(param: UsersApiUpdateUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<UserResponse>> {
        return this.api.updateUserWithHttpInfo(param.userId, param.inputUpdateUser,  options).toPromise();
    }

    /**
     * Update an existing user
     * @param param the request object
     */
    public updateUser(param: UsersApiUpdateUserRequest, options?: ConfigurationOptions): Promise<UserResponse> {
        return this.api.updateUser(param.userId, param.inputUpdateUser,  options).toPromise();
    }

}
