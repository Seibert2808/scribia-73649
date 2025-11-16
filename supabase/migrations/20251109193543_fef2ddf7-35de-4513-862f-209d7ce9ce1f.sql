-- Adicionar novos valores ao enum app_role (apenas enum, sem usar os valores ainda)
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'organizador_evento';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'patrocinador_evento';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'palestrante_influencer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'participante_evento';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'usuario_individual';