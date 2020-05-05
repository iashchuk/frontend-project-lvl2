// @ts-check

import { DiffType } from "..";

export default (diff: DiffType[]) => JSON.stringify(diff, null, 2);
