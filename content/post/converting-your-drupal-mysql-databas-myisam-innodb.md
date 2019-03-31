---
title: "Converting your Drupal MySQL databas from MyISAM to InnoDB "
date: 2009-10-31T17:32:22+01:00
lastmod: 2012-08-16T06:35:00+02:00
author: "Fredrik Jonsson"
tags: ["convert","drupal","innodb","myisam","mysql","development"]
aliases: ["node/1268"]

---



In Drupal 7 [InnoDB will replace MyISAM](http://drupal.org/node/301362) as the default storage engine for increased scalability and data integrity. Most big sites are already using InnoDB, drupal.org does since some time.

InnoDB is generally a better choice for Drupal so why wait for Drupal 7. Lets go ahead and convert our Drupal 6 tables to InnoDB.

As always, make sure you have backups of everything before you do this on a production site!

### Convert a database to InnoDB

Here follows some commands to run on the command line that will make the conversion a breeze.

The first command I found on "Ryan's Tech Notes", se below. It will generate a file with sql commands to altar every table in the specified databas to InnoDB.

The second command is a Perl one liner to set the search_* tables back to MyISAM. This is done for performance reasons and to avoid the large index that InnoDB will generate on these tables.

**Update 2010-01-03**: According to Steve Rude at [divx.com](http://divx.com/) the menu_router table should also be MyISAM for best performance. 

The last command executes the sql commands that converts the tables to InnoDB.

~~~~
mysql -u [USER_NAME] -p -e "SHOW TABLES IN [DATABASE_NAME];" | tail -n +2 | xargs -I '{}' echo "ALTER TABLE {} ENGINE=INNODB;" > alter_table.sql
perl -p -i -e 's/(search_[a-z_]+ ENGINE=)INNODB/\1MYISAM/g' alter_table.sql
mysql -u [USER_NAME] -p [DATABASE_NAME] < alter_table.sql
~~~~

If you are using [Drush](http://drupal.org/project/drush), and you really should, you can use these commands instead.

~~~~
cd /path/to/drupal/directory
drush sql-query "SHOW TABLES" | tail -n +2 | xargs -I '{}' echo "ALTER TABLE {} ENGINE=INNODB;" > alter_table.sql
perl -p -i -e 's/(search_[a-z_]+ ENGINE=)INNODB/\1MYISAM/g' alter_table.sql
cat alter_table.sql | `drush sql-connect`
~~~~

If you have a big database it can take some minutes to convert all the tables to InnoDB.

### InnoDB parameters

Here are the current InnoDB settings I use for the server xdeb.org runs on, a small VPS. The values you most likely need to adjust for your server is "innodb_buffer_pool_size" and "innodb_log_file_size".

~~~~
innodb_buffer_pool_size = 256M
innodb_additional_mem_pool_size = 10M
innodb_log_file_size = 32M
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 0
~~~~

When changing innodb_log_file_size you will need to:

1. Stop the MySQL server
2. Move away ib_logfile0 and ib_logfile1 (On Debian they are in /var/lib/mysql)
3. Change the innodb_log_file_size
4. Restart the MySQL server
5. Confirm new ib_logfile0 and ib_logfile1 has been created
6. Have a look in the logs to make sure everything is in order.

Make sure to comment out "skip-innodb" in your MySQL config file if it exists.

~~~~
#skip-innodb
~~~~

If you want to make InnoDB the default storage engine for new tables, where no engine is specified, you can add this to your MySQL config file.

~~~~
default-storage-engine = innodb
~~~~


### MyISAM only parameters

These are MyISAM only parameters that you most likely can set to lower values to save RAM now that most tables are converted to InnoDB.

* bulk_insert_buffer_size
* key_buffer_size
* key_cache_age_threshold
* key_cache_block_size
* key_cache_division_limit
* read_buffer_size
* read_rnd_buffer_size


### Some good links for more reading

* [MySQL Engines: MyISAM vs. InnoDB | Tag1 Consulting, Inc.](http://tag1consulting.com/MySQL_Engines_MyISAM_vs_InnoDB)
* [InnoDB Performance Tuning | Tag1 Consulting, Inc.](http://tag1consulting.com/InnoDB_Performance_Tuning)
* [How to Convert MySQL from MyISAM to InnoDB Using a Script « Ryan's Tech Notes](http://technotes.twosmallcoins.com/?p=356)
* [Performance tuning tips for Drupal 7 testing. | testing.drupal.org](http://testing.drupal.org/performance-tuning-tips-for-D7)
* [There is no place like 127.0.0.1: Differences Between innodb_data_file_path and innodb_file_per_table](http://gala4th.blogspot.com/2009/04/differences-between-innodbdatafilepath.html)

