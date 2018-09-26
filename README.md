# CashTUI

**Warning: this software is experimental, under construction and in a pre-Alpha state.  Do not use with sensitive production nodes or nodes that contain wallet balances.**

CashTUI (pronounced "cash-too-ee") is a [text-based user interface](https://en.wikipedia.org/wiki/Text-based_user_interface) for interacting with a Bitcoin Cash node.  It may be of benefit to:

* Bitcoin Cash developers
* Operators wanting low level access to their node but something easier to use than entering RPC commands in the Bitcoin QT debug window.
* In cases where the node is installed on a server with no windowing system (ie no GUI support)

## Requirements

1. A current version of Node.js and NPM.
2. A local or accessible Bitcoin Cash node running with the `-server` option.  CashTUI is being developed against a Bitcoin Unlimited node but should also work with Bitcoin SV and Bitcoin ABC.

## Installing

In a console window or shell, run:

1. `npm install -g cashtui`
2. `cashtui`

If step two fails, then node global packages aren't in your environment's path variable.  In that case, you can run `npx cashtui` instead.

## Connecting to your node

After selecting the network type, the Connection Settings page will be displayed with defaults that may work out of the box.  If not, you may need to check the options that you used to start your node.  Particularly important is that the node has been started with the `-server` flag.  

CashTUI currently supports authenticating via:

1. An automatically generated `.cookie` file in your node's data directory, or
2. A user and password set with the `-rpcuser` and `-rpcpassword` node startup flags.

Choose one method (e.g. user/password) and clear the other values (e.g. cookie file) in the CashTUI connection settings.

**WARNING**
Any passwords entered into CashTUI are currently stored in plain text in the application data folder for your operating system.  Do not use CashTUI with sensitive production nodes or nodes with wallet balances.

