#!/usr/bin/env sh

hugo && rsync -e 'ssh -ax -p 2222' --archive --delete --verbose --compress --human-readable --exclude '.DS_Store' --exclude 'reunion' public/ eto.xdeb.net:/var/www/customers/frjo/web/
