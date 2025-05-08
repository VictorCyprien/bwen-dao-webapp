// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { InputCreateProposal } from '../models/InputCreateProposal';
import { PagingError } from '../models/PagingError';
import { PodProposalListResponse } from '../models/PodProposalListResponse';
import { Proposal } from '../models/Proposal';
import { ProposalSchemaResponse } from '../models/ProposalSchemaResponse';
import { ProposalUpdate } from '../models/ProposalUpdate';
import { ProposalVote } from '../models/ProposalVote';
import { ProposalVoteResponse } from '../models/ProposalVoteResponse';

/**
 * no description
 */
export class ProposalsApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Create a new proposal for this specific DAO
     * @param daoId 
     * @param inputCreateProposal 
     */
    public async createProposalForDAO(daoId: string, inputCreateProposal: InputCreateProposal, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "createProposalForDAO", "daoId");
        }


        // verify required parameter 'inputCreateProposal' is not null or undefined
        if (inputCreateProposal === null || inputCreateProposal === undefined) {
            throw new RequiredError("ProposalsApi", "createProposalForDAO", "inputCreateProposal");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(inputCreateProposal, "InputCreateProposal", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Create a new proposal for this specific POD
     * @param daoId 
     * @param podId 
     * @param inputCreateProposal 
     */
    public async createProposalForPOD(daoId: string, podId: string, inputCreateProposal: InputCreateProposal, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "createProposalForPOD", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "createProposalForPOD", "podId");
        }


        // verify required parameter 'inputCreateProposal' is not null or undefined
        if (inputCreateProposal === null || inputCreateProposal === undefined) {
            throw new RequiredError("ProposalsApi", "createProposalForPOD", "inputCreateProposal");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(inputCreateProposal, "InputCreateProposal", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete a proposal for a DAO
     * @param daoId 
     * @param proposalId 
     */
    public async deleteDAOProposal(daoId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "deleteDAOProposal", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "deleteDAOProposal", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete a proposal for a POD
     * @param daoId 
     * @param podId 
     * @param proposalId 
     */
    public async deletePODProposal(daoId: string, podId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "deletePODProposal", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "deletePODProposal", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "deletePODProposal", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all active proposals for a specific DAO
     * @param daoId 
     */
    public async getActiveProposalsByDAO(daoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getActiveProposalsByDAO", "daoId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/active'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all active proposals for a specific POD
     * @param daoId 
     * @param podId 
     */
    public async getActiveProposalsByPOD(daoId: string, podId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getActiveProposalsByPOD", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "getActiveProposalsByPOD", "podId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/active'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get a specific proposal for a DAO
     * @param daoId 
     * @param proposalId 
     */
    public async getDAOProposalById(daoId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getDAOProposalById", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "getDAOProposalById", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get a specific proposal for a POD
     * @param daoId 
     * @param podId 
     * @param proposalId 
     */
    public async getPODProposalById(daoId: string, podId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalById", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalById", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalById", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get vote counts for a POD proposal
     * @param daoId 
     * @param podId 
     * @param proposalId 
     */
    public async getPODProposalVotes(daoId: string, podId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalVotes", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalVotes", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "getPODProposalVotes", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get vote counts for a proposal
     * @param daoId 
     * @param proposalId 
     */
    public async getProposalVotes(daoId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getProposalVotes", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "getProposalVotes", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all proposals for a specific DAO
     * @param daoId 
     */
    public async getProposalsByDAO(daoId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getProposalsByDAO", "daoId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get all proposals for a specific POD
     * @param daoId 
     * @param podId 
     */
    public async getProposalsByPOD(daoId: string, podId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "getProposalsByPOD", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "getProposalsByPOD", "podId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove a user\'s vote from a proposal
     * @param daoId 
     * @param proposalId 
     */
    public async removeVoteFromDAOProposal(daoId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "removeVoteFromDAOProposal", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "removeVoteFromDAOProposal", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Remove a vote from a POD proposal
     * @param daoId 
     * @param podId 
     * @param proposalId 
     */
    public async removeVoteFromPODProposal(daoId: string, podId: string, proposalId: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "removeVoteFromPODProposal", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "removeVoteFromPODProposal", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "removeVoteFromPODProposal", "proposalId");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update a proposal for a DAO
     * @param daoId 
     * @param proposalId 
     * @param proposalUpdate 
     */
    public async updateDAOProposal(daoId: string, proposalId: string, proposalUpdate: ProposalUpdate, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "updateDAOProposal", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "updateDAOProposal", "proposalId");
        }


        // verify required parameter 'proposalUpdate' is not null or undefined
        if (proposalUpdate === null || proposalUpdate === undefined) {
            throw new RequiredError("ProposalsApi", "updateDAOProposal", "proposalUpdate");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(proposalUpdate, "ProposalUpdate", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update a proposal for a POD
     * @param daoId 
     * @param podId 
     * @param proposalId 
     * @param proposalUpdate 
     */
    public async updatePODProposal(daoId: string, podId: string, proposalId: string, proposalUpdate: ProposalUpdate, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "updatePODProposal", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "updatePODProposal", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "updatePODProposal", "proposalId");
        }


        // verify required parameter 'proposalUpdate' is not null or undefined
        if (proposalUpdate === null || proposalUpdate === undefined) {
            throw new RequiredError("ProposalsApi", "updatePODProposal", "proposalUpdate");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(proposalUpdate, "ProposalUpdate", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Vote on a proposal for a DAO
     * @param daoId 
     * @param proposalId 
     * @param proposalVote 
     */
    public async voteOnDAOProposal(daoId: string, proposalId: string, proposalVote: ProposalVote, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnDAOProposal", "daoId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnDAOProposal", "proposalId");
        }


        // verify required parameter 'proposalVote' is not null or undefined
        if (proposalVote === null || proposalVote === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnDAOProposal", "proposalVote");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(proposalVote, "ProposalVote", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Vote on a POD proposal
     * @param daoId 
     * @param podId 
     * @param proposalId 
     * @param proposalVote 
     */
    public async voteOnPODProposal(daoId: string, podId: string, proposalId: string, proposalVote: ProposalVote, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'daoId' is not null or undefined
        if (daoId === null || daoId === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnPODProposal", "daoId");
        }


        // verify required parameter 'podId' is not null or undefined
        if (podId === null || podId === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnPODProposal", "podId");
        }


        // verify required parameter 'proposalId' is not null or undefined
        if (proposalId === null || proposalId === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnPODProposal", "proposalId");
        }


        // verify required parameter 'proposalVote' is not null or undefined
        if (proposalVote === null || proposalVote === undefined) {
            throw new RequiredError("ProposalsApi", "voteOnPODProposal", "proposalVote");
        }


        // Path Params
        const localVarPath = '/proposals/dao/{dao_id}/pod/{pod_id}/{proposal_id}/vote'
            .replace('{' + 'dao_id' + '}', encodeURIComponent(String(daoId)))
            .replace('{' + 'pod_id' + '}', encodeURIComponent(String(podId)))
            .replace('{' + 'proposal_id' + '}', encodeURIComponent(String(proposalId)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(proposalVote, "ProposalVote", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        
        const defaultAuth: SecurityAuthentication | undefined = _config?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class ProposalsApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createProposalForDAO
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createProposalForDAOWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User is not a member of this DAO or lacks permission", body, response.headers);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Invalid data", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO not found", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createProposalForPOD
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createProposalForPODWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User is not a member of this POD or lacks permission", body, response.headers);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Invalid data", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD not found", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteDAOProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteDAOProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Error deleting proposal or Proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User lacks permission to cancel this proposal", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deletePODProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deletePODProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Error deleting proposal or Proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User lacks permission to delete this proposal", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getActiveProposalsByDAO
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getActiveProposalsByDAOWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Proposal> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Proposal> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Proposal>", ""
            ) as Array<Proposal>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Proposal> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Proposal>", ""
            ) as Array<Proposal>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getActiveProposalsByPOD
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getActiveProposalsByPODWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PodProposalListResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PodProposalListResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PodProposalListResponse", ""
            ) as PodProposalListResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: PodProposalListResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PodProposalListResponse", ""
            ) as PodProposalListResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getDAOProposalById
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getDAOProposalByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Proposal >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Proposal = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Proposal", ""
            ) as Proposal;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Proposal = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Proposal", ""
            ) as Proposal;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getPODProposalById
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getPODProposalByIdWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Proposal >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Proposal = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Proposal", ""
            ) as Proposal;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Proposal = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Proposal", ""
            ) as Proposal;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getPODProposalVotes
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getPODProposalVotesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getProposalVotes
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getProposalVotesWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getProposalsByDAO
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getProposalsByDAOWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Proposal> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Proposal> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Proposal>", ""
            ) as Array<Proposal>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Proposal> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Proposal>", ""
            ) as Array<Proposal>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getProposalsByPOD
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getProposalsByPODWithHttpInfo(response: ResponseContext): Promise<HttpInfo<PodProposalListResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: PodProposalListResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PodProposalListResponse", ""
            ) as PodProposalListResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: PodProposalListResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PodProposalListResponse", ""
            ) as PodProposalListResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to removeVoteFromDAOProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async removeVoteFromDAOProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal is not active, user has not voted, or proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to removeVoteFromPODProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async removeVoteFromPODProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal is not active, user has not voted, or proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User is not a member of this POD or lacks permission", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateDAOProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateDAOProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Invalid data or Proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User lacks permission to update this proposal", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updatePODProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updatePODProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalSchemaResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Invalid data or Proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User lacks permission to update this proposal", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalSchemaResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalSchemaResponse", ""
            ) as ProposalSchemaResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to voteOnDAOProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async voteOnDAOProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal is not active, user has already voted, or proposal does not belong to this DAO", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User is not a member of this DAO or lacks permission", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "DAO or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to voteOnPODProposal
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async voteOnPODProposalWithHttpInfo(response: ResponseContext): Promise<HttpInfo<ProposalVoteResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Unprocessable Entity", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Bad Request - Proposal is not active, user has already voted, or proposal does not belong to this POD", body, response.headers);
        }
        if (isCodeInRange("403", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Forbidden - User is not a member of this POD or lacks permission", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "Unauthorized - Invalid or missing token", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: PagingError = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "PagingError", ""
            ) as PagingError;
            throw new ApiException<PagingError>(response.httpStatusCode, "POD or Proposal not found", body, response.headers);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            const body: Error = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Error", ""
            ) as Error;
            throw new ApiException<Error>(response.httpStatusCode, "Default error response", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: ProposalVoteResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ProposalVoteResponse", ""
            ) as ProposalVoteResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
