import { api } from '#/config/api';
import baseService from '#/services/base-service';
import type { PartnerResponse, PartnerTier } from '../types';
import { unwrapPartner } from '../types';
import type { Partner } from './types';

export type { Partner, PartnerStatus } from './types';

export const getPartnerInfo = async () =>
  unwrapPartner<Partner>(
    await baseService.get<PartnerResponse<Partner>>(`${api.partner.auth}/info`),
  );

export const updatePartnerProfile = async (payload: Partial<Partner>) =>
  unwrapPartner<Partner>(
    await baseService.put<PartnerResponse<Partner>>(
      `${api.partner.auth}/profile`,
      payload,
    ),
  );

export const getPartnerTier = async () =>
  unwrapPartner<PartnerTier>(
    await baseService.get<PartnerResponse<PartnerTier>>(
      `${api.partner.auth}/tier`,
    ),
  );
