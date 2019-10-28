/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { ICommandDefinition } from "@zowe/imperative";

import i18nTypings from "../../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../../-strings-/en").default as typeof i18nTypings).DELETE.RESOURCES.WEBSERVICE;

export const WebServiceDefinition: ICommandDefinition = {
    name: "webservice",
    aliases: ["web"],
    description: strings.DESCRIPTION,
    handler: __dirname + "/Webservice.handler",
    type: "command",
    positionals: [{
        name: "webserviceName",
        description: strings.POSITIONALS.WEBSERVICENAME,
        type: "string",
        required: true
    }, {
        name: "csdGroup",
        description: strings.POSITIONALS.CSDGROUP,
        type: "string",
        required: true
    }],
    options: [{
        name: "region-name",
        description: strings.OPTIONS.REGIONNAME,
        type: "string"
    }],
    profile: {optional: ["cics"]},
    examples: [{
        description: strings.EXAMPLES.EX1,
        options: "WEBSVCA MYGRP --region-name MYREGION"
    }]
};
