### atom-openssl-details

Allows you to take the certificate data and either decode it to check its details or generate the bundle chain using [Cloudflare's PKI and TLS toolkit](https://github.com/cloudflare/cfssl).

#### Configuration

If binaries are not found on your default path they can be specified in the `config.cson`.

```
"atom-openssl-details":
  display: true
  openssl: "/usr/bin/openssl"
  cfssl: "/usr/local/bin/cfssl"
  jq: "/usr/local/bin/jq"
```

#### Usage


##### Decode

* Certificate can be either loaded from a file or pasted in, once loaded highlight the certificate data and click `Packages` => `SSL Cert Details` => `Decode`.


##### Bundle

* Certificate can be either loaded from a file or pasted in, once loaded highlight the certificate data and click `Packages` => `SSL Cert Details` => `Generate Bundle`.
