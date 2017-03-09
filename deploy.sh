#!/usr/bin/env sh

hugo && rsync -e 'ssh -ax -p 2222' -avz --delete --exclude '.DS_Store' public/ seldon.combonet.se:/var/www/customers/frjo/web/xdeb/beta/
