import type { IconType } from "react-icons";

export type IconComponent = IconType;

export type IconPackId = "tb" | "hi2" | "rx";

export interface IconPackDescriptor {
  id: IconPackId;
  label: string;
  prefix: string;
  loadModule: () => Promise<Record<string, unknown>>;
}

export interface IconCatalogItem {
  id: string;
  pack: IconPackId;
  name: string;
  exportName: string;
  keywords: string[];
}

interface IconPackCacheRecord {
  module: Record<string, unknown>;
  items: IconCatalogItem[];
  byId: Map<string, IconCatalogItem>;
}

export const ICON_PACKS: IconPackDescriptor[] = [
  {
    id: "tb",
    label: "Tabler",
    prefix: "Tb",
    loadModule: () => import("react-icons/tb"),
  },
  {
    id: "hi2",
    label: "Heroicons",
    prefix: "Hi",
    loadModule: () => import("react-icons/hi2"),
  },
  {
    id: "rx",
    label: "Radix",
    prefix: "Rx",
    loadModule: () => import("react-icons/rx"),
  },
];

const PACK_MAP = new Map(ICON_PACKS.map((pack) => [pack.id, pack]));

export const DEFAULT_ICON_ID = "tb:home";
export const DEFAULT_ICON_PACK_ID: IconPackId = "tb";

const cache = new Map<IconPackId, IconPackCacheRecord>();
const pendingLoads = new Map<IconPackId, Promise<IconPackCacheRecord>>();

const toWordsFromPascalCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim();

const slugFromWords = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildPackItems = ({
  pack,
  module,
}: {
  pack: IconPackDescriptor;
  module: Record<string, unknown>;
}): IconPackCacheRecord => {
  const exportEntries = Object.entries(module)
    .filter(([exportName, exportedValue]) => {
      if (!exportName.startsWith(pack.prefix)) return false;
      return typeof exportedValue === "function";
    })
    .sort(([a], [b]) => a.localeCompare(b));

  const items = exportEntries.map(([exportName]) => {
    const nameChunk = exportName.slice(pack.prefix.length);
    const readableName = toWordsFromPascalCase(nameChunk);
    const keywords = readableName
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 1);
    keywords.push(pack.id.toLowerCase(), pack.label.toLowerCase());

    return {
      id: `${pack.id}:${slugFromWords(readableName)}`,
      pack: pack.id,
      name: readableName,
      exportName,
      keywords,
    } satisfies IconCatalogItem;
  });

  const byId = new Map(items.map((item) => [item.id, item]));

  return {
    module,
    items,
    byId,
  };
};

const getKnownPack = (packId: IconPackId): IconPackDescriptor => {
  const pack = PACK_MAP.get(packId);
  if (!pack) {
    throw new Error(`Unknown icon pack: ${packId}`);
  }
  return pack;
};

export const parseIconId = (iconId: string | undefined) => {
  if (!iconId) {
    return {
      packId: DEFAULT_ICON_PACK_ID,
      symbol: "home",
      normalizedId: DEFAULT_ICON_ID,
    };
  }

  const [rawPackId, ...rest] = iconId.split(":");
  const symbol = rest.join(":");
  if (!rawPackId || !symbol) {
    return {
      packId: DEFAULT_ICON_PACK_ID,
      symbol: "home",
      normalizedId: DEFAULT_ICON_ID,
    };
  }

  if (!PACK_MAP.has(rawPackId as IconPackId)) {
    return {
      packId: DEFAULT_ICON_PACK_ID,
      symbol: "home",
      normalizedId: DEFAULT_ICON_ID,
    };
  }

  return {
    packId: rawPackId as IconPackId,
    symbol,
    normalizedId: `${rawPackId}:${symbol}`,
  };
};

export const normalizeIconId = (iconId: string | undefined) =>
  parseIconId(iconId).normalizedId;

export const loadIconPack = async (packId: IconPackId) => {
  const cached = cache.get(packId);
  if (cached) return cached;

  const inflight = pendingLoads.get(packId);
  if (inflight) return inflight;

  const pack = getKnownPack(packId);
  const promise = pack
    .loadModule()
    .then((module) => {
      const built = buildPackItems({
        pack,
        module: module as Record<string, unknown>,
      });
      cache.set(packId, built);
      pendingLoads.delete(packId);
      return built;
    })
    .catch((error) => {
      pendingLoads.delete(packId);
      throw error;
    });

  pendingLoads.set(packId, promise);
  return promise;
};

export const getCachedIconPack = (packId: IconPackId) => cache.get(packId);

export const resolveIconCatalogItem = async (iconId: string | undefined) => {
  const { packId, normalizedId } = parseIconId(iconId);
  const loadedPack = await loadIconPack(packId);
  if (loadedPack.byId.has(normalizedId)) {
    return loadedPack.byId.get(normalizedId);
  }

  const fallbackPack = await loadIconPack(DEFAULT_ICON_PACK_ID);
  return fallbackPack.byId.get(DEFAULT_ICON_ID);
};

export const resolveIconComponent = async (
  iconId: string | undefined,
): Promise<IconComponent | null> => {
  const item = await resolveIconCatalogItem(iconId);
  if (!item) return null;

  const loadedPack = getCachedIconPack(item.pack);
  if (!loadedPack) return null;

  const component = loadedPack.module[item.exportName];
  if (typeof component !== "function") {
    return null;
  }

  return component as IconComponent;
};

export const getCachedIconComponent = (
  iconId: string | undefined,
): IconComponent | null => {
  const { packId, normalizedId } = parseIconId(iconId);
  const loadedPack = getCachedIconPack(packId);
  if (!loadedPack) return null;

  const item = loadedPack.byId.get(normalizedId);
  if (!item) return null;

  const component = loadedPack.module[item.exportName];
  if (typeof component !== "function") {
    return null;
  }

  return component as IconComponent;
};

export const getIconPackLabel = (packId: IconPackId) =>
  getKnownPack(packId).label;
