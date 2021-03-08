#!/usr/bin/env sh

hugo --cleanDestinationDir && rsync -e 'ssh -ax -p 2222' --archive --delete --verbose --compress --human-readable --exclude '.DS_Store' --exclude 'reunion' public/ seldon.combonet.se:/var/www/customers/frjo/web/
