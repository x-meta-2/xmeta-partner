import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type {
  PartnerPaginated,
  PartnerPaginationInput,
  PartnerResponse,
} from '../types';
import { unwrapPartner } from '../types';
import type { Campaign } from './types';

export type { Campaign, CampaignStatus } from './types';

export const listCampaigns = async (params: PartnerPaginationInput = {}) =>
  unwrapPartner<PartnerPaginated<Campaign>>(
    await baseService.post<PartnerResponse<PartnerPaginated<Campaign>>>(
      `${api.partner.campaigns}/list`,
      params,
    ),
  );

export const createCampaign = async (payload: Partial<Campaign>) =>
  unwrapPartner<Campaign>(
    await baseService.post<PartnerResponse<Campaign>>(
      `${api.partner.campaigns}/create`,
      payload,
    ),
  );

export const getCampaign = async (id: string) =>
  unwrapPartner<Campaign>(
    await baseService.get<PartnerResponse<Campaign>>(
      `${api.partner.campaigns}/detail/${id}`,
    ),
  );

export const updateCampaign = async (id: string, payload: Partial<Campaign>) =>
  unwrapPartner<Campaign>(
    await baseService.put<PartnerResponse<Campaign>>(
      `${api.partner.campaigns}/${id}`,
      payload,
    ),
  );

export const deleteCampaign = async (id: string) =>
  unwrapPartner<null>(
    await baseService.delete<PartnerResponse<null>>(
      `${api.partner.campaigns}/${id}`,
    ),
  );
