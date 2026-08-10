# armxy-docs
Official documentation for ARMxy industrial edge gateways, including Node-RED, Modbus, MQTT, OPC UA, CAN and IoT applications.

## Local development

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the docs site:

```bash
mkdocs serve
```

## Internationalization

- Default language: Chinese (`/`)
- English path: `/en/`
- The site uses `mkdocs-static-i18n`
- Pages without an English translation currently fall back to the Chinese source page
