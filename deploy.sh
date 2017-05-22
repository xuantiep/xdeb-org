#!/usr/bin/env sh

hugo && rsync -e 'ssh -ax -p 2222' -avz --human-readable --delete --exclude '.DS_Store' --exclude 'reunion' public/ seldon.combonet.se:/var/www/customers/frjo/web/
