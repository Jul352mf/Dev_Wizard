# Security Design & Strategy

The Dev Wizard must securely handle sensitive information (API keys, secrets, credentials) and protect communications between local agents and cloud services.  This document outlines the security architecture, based on best practices and research.

## Threat model

1. **Local machine compromise:** malware or unauthorised users could read plaintext secrets, environment files or process memory.
2. **Network interception:** traffic between Dev Wizard, MCP agents or cloud services could be eavesdropped or tampered with.
3. **Credential theft:** tokens or API keys stored insecurely could be exfiltrated and used elsewhere.
4. **Privilege escalation:** misuse of the tool could allow secrets from one project or tenant to be accessed by others.

## Secure storage of secrets

Secrets should never be stored in plaintext in files checked into git or in long‑lived environment variables.  The strategy consists of two layers:

1. **OS‑native keychains**
   * **macOS Keychain** – built into macOS.  Secrets are encrypted at rest and accessible only to authorised applications.  CLI access via `security` tool.  Items can be keyed by account and service names.
   * **Windows DPAPI** – Data Protection API encrypts secrets tied to the user or machine; accessible via PowerShell `ConvertTo-SecureString` and `Get-Credential`.  Secrets remain encrypted at rest and can only be decrypted by the same user context.
   * **Linux Secret Service (GNOME Keyring)** – a collection of components that store secrets, passwords and keys and expose them through the `org.freedesktop.secrets` API【183323877738311†L145-L151】.  Applications can securely store and retrieve items as long as the user session is unlocked.  Note that unlocked keyrings can be read by any application in the session【183323877738311†L157-L162】, so headless environments require caution.

   Dev Wizard will provide a pluggable credential store layer.  On each platform it will interface with the native keychain via existing libraries (`keytar` for Node or `keyring`/`secret-tool` for Python).  Secrets retrieved from the keychain will be injected into processes at runtime and removed when processes exit.  For headless Linux servers, secrets may be stored encrypted in the local database using a master key derived from the user’s passphrase.

2. **Centralised configuration manager**
   A tool such as Configu can serve as the authoritative source for environment variables, secrets and feature flags across environments.  Configu offers a unified API and policy framework for storing and mutating configuration data【696141650884648†L30-L67】.  Dev Wizard can synchronise secrets from Configu into OS keychains on initial setup and subsequently fetch updates from Configu when environment variables change.

## Authentication and MFA

* **Supabase and LangSmith tokens:** existing JAGI components rely on Supabase JWTs and LangSmith API keys.  Dev Wizard will reuse these flows.  Tokens are stored in the OS keychain and never written to disk.
* **FIDO2 hardware keys:** FIDO2 is an open standard that replaces passwords with strong, hardware‑based authentication using public‑key cryptography【382439635864551†L298-L303】.  It is designed to work with existing devices via USB or NFC【382439635864551†L306-L311】 and supports single‑factor, two‑factor and multi‑factor modes【382439635864551†L316-L319】.  Dev Wizard will support optional MFA during sign‑in or when viewing sensitive secrets.  When enabled, the user must touch their security key to decrypt a secret or approve a sensitive action.

## Secure communication

* **Local to cloud (MCP agents):** When communicating with remote LangGraph/MCP agents, the tool should always use TLS.  For agent‑to‑agent communication and remote procedure calls, adopt mutual TLS (mTLS).  Workload identities provide short‑lived credentials (X.509 certificates or JWTs) that are automatically renewed【864312483546141†L382-L386】.  Service meshes like Istio upgrade internal connections to mTLS using these workload credentials【864312483546141†L382-L386】.  Workload identities offer strong client authentication without long‑lived secrets, improving manageability and security【864312483546141†L509-L511】.  Dev Wizard will integrate with a workload identity provider (e.g., Google Workload Identity Federation or Teleport Machine ID) to issue short‑lived certificates for local agents.  These certificates will be used to authenticate to cloud services via mTLS.
* **API requests:** All outbound requests to third‑party APIs should use HTTPS.  The HTTP client layer must enforce certificate validation and reject insecure ciphers.  Access tokens should be added via headers and not stored in query parameters.

## Secret injection

Secrets are injected into processes at runtime, not persisted in `.env` files.  When a user runs a command (e.g., starting a dev server), Dev Wizard will:

1. Read the necessary secrets from the keychain or Configu.
2. Export them as environment variables to the child process (shell, container or CLI).  For tools like `direnv`, it can generate a temporary `.envrc` file with the decrypted values and call `direnv allow`.
3. After the process exits, the environment is cleaned up and the `.envrc` (if created) is deleted.

## Key rotation and auditing

* **Rotation:** Supabase, LangSmith and other API keys should be rotated periodically.  Dev Wizard will provide a UI to trigger rotation (e.g., by calling Supabase or Configu APIs) and will update stored values accordingly.
* **Audit trails:** All accesses to secrets, including reads and writes, will be logged locally (without exposing secret values).  Logs will include timestamp, user identity and action performed.  When integrated with LangSmith telemetry, these audit events can be forwarded to a central logging system.

## Summary

The proposed security design combines OS‑native secret storage, centralised configuration management, hardware‑based MFA and mTLS with workload identities.  It minimises the exposure of secrets in memory and on disk, provides strong authentication, and ensures that communications are encrypted and authenticated.  By leveraging existing standards like FIDO2【382439635864551†L298-L303】 and mTLS【864312483546141†L382-L386】, the design avoids reinventing security primitives and aligns with the JAGI platform’s emphasis on robust, production‑grade architecture.