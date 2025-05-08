export * from '../models/ChallengeRequest';
export * from '../models/ChallengeResponse';
export * from '../models/ConnectionResponse';
export * from '../models/ConnectionsList';
export * from '../models/CreateDeviceRequest';
export * from '../models/CreateDeviceResponse';
export * from '../models/DAO';
export * from '../models/DAOMembership';
export * from '../models/DAOMembershipResponse';
export * from '../models/DAOModule';
export * from '../models/DAOModuleAccessResponse';
export * from '../models/DAOModuleResponse';
export * from '../models/DAOModulesList';
export * from '../models/DAOSchemaResponse';
export * from '../models/DAOUpdate';
export * from '../models/DeleteDeviceResponse';
export * from '../models/Device';
export * from '../models/DeviceList';
export * from '../models/DeviceWithKey';
export * from '../models/DisconnectResponse';
export * from '../models/DiscordChannel';
export * from '../models/DiscordChannelResponse';
export * from '../models/DiscordChannelsResponse';
export * from '../models/DiscordMessage';
export * from '../models/DiscordMessagesResponse';
export * from '../models/Governance';
export * from '../models/GovernanceModel';
export * from '../models/GovernanceModelsList';
export * from '../models/GovernanceResponse';
export * from '../models/InitDAOResponse';
export * from '../models/InputCreateDAO';
export * from '../models/InputCreateGovernance';
export * from '../models/InputCreatePOD';
export * from '../models/InputCreateProposal';
export * from '../models/InputCreateRole';
export * from '../models/InputCreateUser';
export * from '../models/InputInitDAO';
export * from '../models/InputUpdateGovernance';
export * from '../models/InputUpdateRole';
export * from '../models/InputUpdateUser';
export * from '../models/LinkDiscordChannel';
export * from '../models/LoginResponse';
export * from '../models/LogoutResponse';
export * from '../models/ModelError';
export * from '../models/OAuthError';
export * from '../models/OAuthResponse';
export * from '../models/POD';
export * from '../models/PODMembership';
export * from '../models/PODMembershipResponse';
export * from '../models/PODSchemaResponse';
export * from '../models/PODUpdate';
export * from '../models/PaginationMetadata';
export * from '../models/PagingError';
export * from '../models/Permission';
export * from '../models/PermissionListResponse';
export * from '../models/PodBasic';
export * from '../models/PodProposalListResponse';
export * from '../models/Proposal';
export * from '../models/ProposalSchemaResponse';
export * from '../models/ProposalUpdate';
export * from '../models/ProposalVote';
export * from '../models/ProposalVoteResponse';
export * from '../models/Role';
export * from '../models/RoleListResponse';
export * from '../models/RolePermissionAssignment';
export * from '../models/RolePermissionResponse';
export * from '../models/RoleResponse';
export * from '../models/SocialConnection';
export * from '../models/TelegramAuth';
export * from '../models/Token';
export * from '../models/Transfer';
export * from '../models/TransferCreate';
export * from '../models/TransferSchemaResponse';
export * from '../models/Treasury';
export * from '../models/User';
export * from '../models/UserBasic';
export * from '../models/UserBasic1';
export * from '../models/UserDAOOwnershipResponse';
export * from '../models/UserExistResponse';
export * from '../models/UserInfoError';
export * from '../models/UserPermissionCheck';
export * from '../models/UserResponse';
export * from '../models/UserRoleAssignment';
export * from '../models/UserRoleCheck';
export * from '../models/UserRoleResponse';
export * from '../models/VerifySignature';

import { ChallengeRequest } from '../models/ChallengeRequest';
import { ChallengeResponse } from '../models/ChallengeResponse';
import { ConnectionResponse } from '../models/ConnectionResponse';
import { ConnectionsList } from '../models/ConnectionsList';
import { CreateDeviceRequest } from '../models/CreateDeviceRequest';
import { CreateDeviceResponse } from '../models/CreateDeviceResponse';
import { DAO } from '../models/DAO';
import { DAOMembership } from '../models/DAOMembership';
import { DAOMembershipResponse } from '../models/DAOMembershipResponse';
import { DAOModule } from '../models/DAOModule';
import { DAOModuleAccessResponse } from '../models/DAOModuleAccessResponse';
import { DAOModuleResponse } from '../models/DAOModuleResponse';
import { DAOModulesList } from '../models/DAOModulesList';
import { DAOSchemaResponse } from '../models/DAOSchemaResponse';
import { DAOUpdate           , DAOUpdateVotingPowerSystemEnum     } from '../models/DAOUpdate';
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
import { Governance   , GovernanceVotingPowerSystemEnum  , GovernanceCouncilEntryConditionEnum   , GovernanceDaoEntryConditionEnum     } from '../models/Governance';
import { GovernanceModel } from '../models/GovernanceModel';
import { GovernanceModelsList } from '../models/GovernanceModelsList';
import { GovernanceResponse } from '../models/GovernanceResponse';
import { InitDAOResponse } from '../models/InitDAOResponse';
import { InputCreateDAO          , InputCreateDAOVotingPowerSystemEnum     } from '../models/InputCreateDAO';
import { InputCreateGovernance , InputCreateGovernanceVotingPowerSystemEnum  , InputCreateGovernanceCouncilEntryConditionEnum   , InputCreateGovernanceDaoEntryConditionEnum     } from '../models/InputCreateGovernance';
import { InputCreatePOD } from '../models/InputCreatePOD';
import { InputCreateProposal } from '../models/InputCreateProposal';
import { InputCreateRole } from '../models/InputCreateRole';
import { InputCreateUser } from '../models/InputCreateUser';
import { InputInitDAO } from '../models/InputInitDAO';
import { InputUpdateGovernance , InputUpdateGovernanceVotingPowerSystemEnum  , InputUpdateGovernanceCouncilEntryConditionEnum   , InputUpdateGovernanceDaoEntryConditionEnum     } from '../models/InputUpdateGovernance';
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
import { ProposalSchemaResponse } from '../models/ProposalSchemaResponse';
import { ProposalUpdate } from '../models/ProposalUpdate';
import { ProposalVote, ProposalVoteVoteEnum     } from '../models/ProposalVote';
import { ProposalVoteResponse , ProposalVoteResponseVoteStatusEnum      } from '../models/ProposalVoteResponse';
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
import { UserBasic } from '../models/UserBasic';
import { UserBasic1 } from '../models/UserBasic1';
import { UserDAOOwnershipResponse } from '../models/UserDAOOwnershipResponse';
import { UserExistResponse } from '../models/UserExistResponse';
import { UserInfoError } from '../models/UserInfoError';
import { UserPermissionCheck } from '../models/UserPermissionCheck';
import { UserResponse } from '../models/UserResponse';
import { UserRoleAssignment } from '../models/UserRoleAssignment';
import { UserRoleCheck } from '../models/UserRoleCheck';
import { UserRoleResponse } from '../models/UserRoleResponse';
import { VerifySignature } from '../models/VerifySignature';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: Set<string> = new Set<string>([
    "DAOUpdateVotingPowerSystemEnum",
    "GovernanceVotingPowerSystemEnum",
    "GovernanceCouncilEntryConditionEnum",
    "GovernanceDaoEntryConditionEnum",
    "InputCreateDAOVotingPowerSystemEnum",
    "InputCreateGovernanceVotingPowerSystemEnum",
    "InputCreateGovernanceCouncilEntryConditionEnum",
    "InputCreateGovernanceDaoEntryConditionEnum",
    "InputUpdateGovernanceVotingPowerSystemEnum",
    "InputUpdateGovernanceCouncilEntryConditionEnum",
    "InputUpdateGovernanceDaoEntryConditionEnum",
    "ProposalVoteVoteEnum",
    "ProposalVoteResponseVoteStatusEnum",
]);

let typeMap: {[index: string]: any} = {
    "ChallengeRequest": ChallengeRequest,
    "ChallengeResponse": ChallengeResponse,
    "ConnectionResponse": ConnectionResponse,
    "ConnectionsList": ConnectionsList,
    "CreateDeviceRequest": CreateDeviceRequest,
    "CreateDeviceResponse": CreateDeviceResponse,
    "DAO": DAO,
    "DAOMembership": DAOMembership,
    "DAOMembershipResponse": DAOMembershipResponse,
    "DAOModule": DAOModule,
    "DAOModuleAccessResponse": DAOModuleAccessResponse,
    "DAOModuleResponse": DAOModuleResponse,
    "DAOModulesList": DAOModulesList,
    "DAOSchemaResponse": DAOSchemaResponse,
    "DAOUpdate": DAOUpdate,
    "DeleteDeviceResponse": DeleteDeviceResponse,
    "Device": Device,
    "DeviceList": DeviceList,
    "DeviceWithKey": DeviceWithKey,
    "DisconnectResponse": DisconnectResponse,
    "DiscordChannel": DiscordChannel,
    "DiscordChannelResponse": DiscordChannelResponse,
    "DiscordChannelsResponse": DiscordChannelsResponse,
    "DiscordMessage": DiscordMessage,
    "DiscordMessagesResponse": DiscordMessagesResponse,
    "Governance": Governance,
    "GovernanceModel": GovernanceModel,
    "GovernanceModelsList": GovernanceModelsList,
    "GovernanceResponse": GovernanceResponse,
    "InitDAOResponse": InitDAOResponse,
    "InputCreateDAO": InputCreateDAO,
    "InputCreateGovernance": InputCreateGovernance,
    "InputCreatePOD": InputCreatePOD,
    "InputCreateProposal": InputCreateProposal,
    "InputCreateRole": InputCreateRole,
    "InputCreateUser": InputCreateUser,
    "InputInitDAO": InputInitDAO,
    "InputUpdateGovernance": InputUpdateGovernance,
    "InputUpdateRole": InputUpdateRole,
    "InputUpdateUser": InputUpdateUser,
    "LinkDiscordChannel": LinkDiscordChannel,
    "LoginResponse": LoginResponse,
    "LogoutResponse": LogoutResponse,
    "ModelError": ModelError,
    "OAuthError": OAuthError,
    "OAuthResponse": OAuthResponse,
    "POD": POD,
    "PODMembership": PODMembership,
    "PODMembershipResponse": PODMembershipResponse,
    "PODSchemaResponse": PODSchemaResponse,
    "PODUpdate": PODUpdate,
    "PaginationMetadata": PaginationMetadata,
    "PagingError": PagingError,
    "Permission": Permission,
    "PermissionListResponse": PermissionListResponse,
    "PodBasic": PodBasic,
    "PodProposalListResponse": PodProposalListResponse,
    "Proposal": Proposal,
    "ProposalSchemaResponse": ProposalSchemaResponse,
    "ProposalUpdate": ProposalUpdate,
    "ProposalVote": ProposalVote,
    "ProposalVoteResponse": ProposalVoteResponse,
    "Role": Role,
    "RoleListResponse": RoleListResponse,
    "RolePermissionAssignment": RolePermissionAssignment,
    "RolePermissionResponse": RolePermissionResponse,
    "RoleResponse": RoleResponse,
    "SocialConnection": SocialConnection,
    "TelegramAuth": TelegramAuth,
    "Token": Token,
    "Transfer": Transfer,
    "TransferCreate": TransferCreate,
    "TransferSchemaResponse": TransferSchemaResponse,
    "Treasury": Treasury,
    "User": User,
    "UserBasic": UserBasic,
    "UserBasic1": UserBasic1,
    "UserDAOOwnershipResponse": UserDAOOwnershipResponse,
    "UserExistResponse": UserExistResponse,
    "UserInfoError": UserInfoError,
    "UserPermissionCheck": UserPermissionCheck,
    "UserResponse": UserResponse,
    "UserRoleAssignment": UserRoleAssignment,
    "UserRoleCheck": UserRoleCheck,
    "UserRoleResponse": UserRoleResponse,
    "VerifySignature": VerifySignature,
}

type MimeTypeDescriptor = {
    type: string;
    subtype: string;
    subtypeTokens: string[];
};

/**
 * Every mime-type consists of a type, subtype, and optional parameters.
 * The subtype can be composite, including information about the content format.
 * For example: `application/json-patch+json`, `application/merge-patch+json`.
 *
 * This helper transforms a string mime-type into an internal representation.
 * This simplifies the implementation of predicates that in turn define common rules for parsing or stringifying
 * the payload.
 */
const parseMimeType = (mimeType: string): MimeTypeDescriptor => {
    const [type = '', subtype = ''] = mimeType.split('/');
    return {
        type,
        subtype,
        subtypeTokens: subtype.split('+'),
    };
};

type MimeTypePredicate = (mimeType: string) => boolean;

// This factory creates a predicate function that checks a string mime-type against defined rules.
const mimeTypePredicateFactory = (predicate: (descriptor: MimeTypeDescriptor) => boolean): MimeTypePredicate => (mimeType) => predicate(parseMimeType(mimeType));

// Use this factory when you need to define a simple predicate based only on type and, if applicable, subtype.
const mimeTypeSimplePredicateFactory = (type: string, subtype?: string): MimeTypePredicate => mimeTypePredicateFactory((descriptor) => {
    if (descriptor.type !== type) return false;
    if (subtype != null && descriptor.subtype !== subtype) return false;
    return true;
});

// Creating a set of named predicates that will help us determine how to handle different mime-types
const isTextLikeMimeType = mimeTypeSimplePredicateFactory('text');
const isJsonMimeType = mimeTypeSimplePredicateFactory('application', 'json');
const isJsonLikeMimeType = mimeTypePredicateFactory((descriptor) => descriptor.type === 'application' && descriptor.subtypeTokens.some((item) => item === 'json'));
const isOctetStreamMimeType = mimeTypeSimplePredicateFactory('application', 'octet-stream');
const isFormUrlencodedMimeType = mimeTypeSimplePredicateFactory('application', 'x-www-form-urlencoded');

// Defining a list of mime-types in the order of prioritization for handling.
const supportedMimeTypePredicatesWithPriority: MimeTypePredicate[] = [
    isJsonMimeType,
    isJsonLikeMimeType,
    isTextLikeMimeType,
    isOctetStreamMimeType,
    isFormUrlencodedMimeType,
];

const nullableSuffix = " | null";
const optionalSuffix = " | undefined";
const arrayPrefix = "Array<";
const arraySuffix = ">";
const mapPrefix = "{ [key: string]: ";
const mapSuffix = "; }";

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap.has(expectedType)) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    let mapping = typeMap[expectedType].mapping;
                    if (mapping != undefined && mapping[discriminatorType]) {
                        return mapping[discriminatorType]; // use the type given in the discriminator
                    } else if(typeMap[discriminatorType]) {
                        return discriminatorType;
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string, format: string): any {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.endsWith(nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.serialize(data, subType, format);
        } else if (type.endsWith(optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.serialize(data, subType, format);
        } else if (type.startsWith(arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let date of data) {
                transformedData.push(ObjectSerializer.serialize(date, subType, format));
            }
            return transformedData;
        } else if (type.startsWith(mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.serialize(
                    data[key],
                    subType,
                    format,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            if (format == "date") {
                let month = data.getMonth()+1
                month = month < 10 ? "0" + month.toString() : month.toString()
                let day = data.getDate();
                day = day < 10 ? "0" + day.toString() : day.toString();

                return data.getFullYear() + "-" + month + "-" + day;
            } else {
                return data.toISOString();
            }
        } else {
            if (enumsMap.has(type)) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let attributeType of attributeTypes) {
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type, attributeType.format);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string, format: string): any {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.endsWith(nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.deserialize(data, subType, format);
        } else if (type.endsWith(optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.deserialize(data, subType, format);
        } else if (type.startsWith(arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let date of data) {
                transformedData.push(ObjectSerializer.deserialize(date, subType, format));
            }
            return transformedData;
        } else if (type.startsWith(mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.deserialize(
                    data[key],
                    subType,
                    format,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap.has(type)) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let attributeType of attributeTypes) {
                let value = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type, attributeType.format);
                if (value !== undefined) {
                    instance[attributeType.name] = value;
                }
            }
            return instance;
        }
    }


    /**
     * Normalize media type
     *
     * We currently do not handle any media types attributes, i.e. anything
     * after a semicolon. All content is assumed to be UTF-8 compatible.
     */
    public static normalizeMediaType(mediaType: string | undefined): string | undefined {
        if (mediaType === undefined) {
            return undefined;
        }
        return (mediaType.split(";")[0] ?? '').trim().toLowerCase();
    }

    /**
     * From a list of possible media types, choose the one we can handle best.
     *
     * The order of the given media types does not have any impact on the choice
     * made.
     */
    public static getPreferredMediaType(mediaTypes: Array<string>): string {
        /** According to OAS 3 we should default to json */
        if (mediaTypes.length === 0) {
            return "application/json";
        }

        const normalMediaTypes = mediaTypes.map(ObjectSerializer.normalizeMediaType);

        for (const predicate of supportedMimeTypePredicatesWithPriority) {
            for (const mediaType of normalMediaTypes) {
                if (mediaType != null && predicate(mediaType)) {
                    return mediaType;
                }
            }
        }

        throw new Error("None of the given media types are supported: " + mediaTypes.join(", "));
    }

    /**
     * Convert data to a string according the given media type
     */
    public static stringify(data: any, mediaType: string): string {
        if (isTextLikeMimeType(mediaType)) {
            return String(data);
        }

        if (isJsonLikeMimeType(mediaType)) {
            return JSON.stringify(data);
        }

        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.stringify.");
    }

    /**
     * Parse data from a string according to the given media type
     */
    public static parse(rawData: string, mediaType: string | undefined) {
        if (mediaType === undefined) {
            throw new Error("Cannot parse content. No Content-Type defined.");
        }

        if (isTextLikeMimeType(mediaType)) {
            return rawData;
        }

        if (isJsonLikeMimeType(mediaType)) {
            return JSON.parse(rawData);
        }

        throw new Error("The mediaType " + mediaType + " is not supported by ObjectSerializer.parse.");
    }
}
