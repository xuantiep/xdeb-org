---
title: "How to set up Apache Solr search for Drupal 6 on a Debian GNU/Linux server"
date: 2009-06-01T20:39:44+02:00
lastmod: 2010-06-04T13:29:39+02:00
author: "Fredrik Jonsson"
tags: ["apache","debian","drupal","drupalcamp","search","solr","development"]
aliases:
  - /node/1213/
slug: "how-to-set-up-apache-solr-search-for-drupal-6-on-a-debian-gnu-linux-server"

---

{{< figure src="/images/solr_FC.jpg" width="283" class="right" alt="solr FC" >}}

At DrupalCamp Stockholm 2009 Robert Douglass from [Acquia](http://acquia.com/) talked about Drupal with Apache Solr search. Solr takes searching in Drupal a huge step forward. Speed and faceted search on author/type/term/language/date/CCK fields are the main features. A "Did you mean …" function is there also and it works surprisingly well.

There are also some really interesting things coming like multi site searching, dokument searching and searching of external non Drupal sites.

[Drupal.org](http://drupal.org/) is already using Apache Solr search. Search for Sweden there and I'm the top result! <http://drupal.org/search/apachesolr_search/sweden>

When you search on Drupal.org or here on xdeb.org check out the blocks at the side of the search result page. They let you sort the result and filter it by author, node type and taxonomy terms. This is faceted search.

For people who don't want to set up and maintain there own Apache Solr search Acquia has the service [Acquia Search](http://acquia.com/products-services/acquia-search) with a 30 day trial.

If you still here and want to know how to set up Apache Solr for Drupal 6 on a Debian GNU/Linux server here follows how I did it.

[Apache Solr](http://lucene.apache.org/solr/) is a Java application and the best way to run it is on a [Apache Tomcat](http://tomcat.apache.org/) server.

We start of by installing the  Sun Java Development Kit (JDK) 6 package.

~~~~
aptitude install sun-java6-jdk
~~~~

Debian etch (and lenny) only has Tomcat 5.5 as a package and Solr want Tomcat 6 so we need to do a manual install. I decided  to put it in /opt but you can use /usr/local also. (If you do, remember to change all the "/opt" paths below.)

~~~~
wget http://apache.osuosl.org/tomcat/tomcat-6/v6.0.20/bin/apache-tomcat-6.0.20.tar.gz
tar -xvzf apache-tomcat-6.0.20.tar.gz
mv apache-tomcat-6.0.20 /opt/tomcat6
~~~~

Now we are ready to install Solr itself. We need to get [Solr version 1.4.x](http://www.apache.org/dyn/closer.cgi/lucene/solr/).

~~~~
wget http://apache.osuosl.org/lucene/solr/1.4.0/apache-solr-1.4.0.tgz
tar -xvzf apache-solr-1.4.0.tgz
cp apache-solr-1.4.0/dist/apache-solr-1.4.0.war /opt/tomcat6/webapps/solr.war
cp -r apache-solr-1.4.0/example/solr /opt/solr
~~~~

Next up are the Solr configuration files.

~~~~
mkdir -p /opt/tomcat6/conf/Catalina/localhost/
vim /opt/tomcat6/conf/Catalina/localhost/solr.xml
~~~~

Put the following in the solr.xml file.

~~~~
<Context docBase="/opt/tomcat6/webapps/solr.war" debug="0" crossContext="true" >
  <Environment name="solr/home" type="java.lang.String" value="/opt/solr" override="true" />
</Context>
~~~~

The Tomcat server don't use UTF-8 as default and this need to be fixed if we want to be able to search for any high ASCII characters like the Swedish åäö, German üß etc.

The file that needs editing is "/opt/tomcat6/conf/server.xml". Look for the line "Connector port="8080"". At the end we need to add "URIEncoding="UTF-8"", it should look like below. You may also want to add "address="127.0.0.1"" to ensured that only services running locally can connect to Tomcat.

~~~~
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               address="127.0.0.1"
               URIEncoding="UTF-8" />
~~~~

Everything to run Apache Solr are now installed and we just need to set up things for auto start/stop/restart.

I like the Debian system of having a file in "/etc/default" with a simple ENABLED setting. With this you can easily enable/disable a service. If you for some reason want do disable Tomcat/Solr you just set "ENABLED=0" and the service will not autostart.

~~~~
echo "ENABLED=1" > /etc/default/tomcat
~~~~

Then the script itself.

~~~~
vim /etc/init.d/tomcat
~~~~

Put the following in the tomcat file.

~~~~
# Tomcat auto-start
#
# description: Auto-starts tomcat
# processname: tomcat
# pidfile: /var/run/tomcat.pid

ENABLED=0

if [ -f /etc/default/tomcat ]; then
  . /etc/default/tomcat
fi

if [ "$ENABLED" = "0" ]; then
  exit 0
fi

export JAVA_HOME=/usr/lib/jvm/java-6-sun/jre
export JAVA_OPTS="$JAVA_OPTS -Dsolr.solr.home=/opt/solr"
export CATALINA_OPTS="-Xms64m -Xmx64m"

case $1 in
start)
  sh /opt/tomcat6/bin/startup.sh
  ;;
stop)
  sh /opt/tomcat6/bin/shutdown.sh
  ;;
restart)
  sh /opt/tomcat6/bin/shutdown.sh
  sh /opt/tomcat6/bin/startup.sh
  ;;
esac
exit 0
~~~~

The CATALINA_OPTS parameter controls how much RAM Tomcat is. The default was to high for my VPS so I set it down to 64 MB. I have not investigated what the optimum is here but it seems works for my small site at least.

-Xms[size] set initial Java heap size  
-Xmx[size] set maximum Java heap size

Make the script executable and add the appropriate symbolic links to cause the script to be executed when the system goes down, or comes up.

~~~~
chmod 755 /etc/init.d/tomcat
update-rc.d tomcat defaults
~~~~

Now we can start Apache Tomcat and Solr with this command. (On reboots it will automatically start.)

~~~~
invoke-rc.d tomcat start
~~~~

With all that done on the server we are now ready to install the [Apache Solr Search Integration](http://drupal.org/project/apachesolr) module for Drupal.

Follow the install instructions and when you come to replacing schema.xml and solrconfig.xml the directory for that is "/opt/solr/conf".

The only setting for the apachesolr module you need to change is the Solr port at "admin/settings/apachesolr". Set it to the default Tomcat port 8080 (or whatever you have told Tomcat to run on).

You probably want to activate some of the apachesolr blocks since it there most of the cool functions resides.

Make sure you reindex your site with solr at "admin/settings/apachesolr/index".

**Update 2009-09-27**: There are now a setting hidden under "Advanced configuration" that "Make Apache Solr Search the default" so the code below is no longer necessary.

The final hurdle is to point the search field to "search/apachesolr_search" instead of "search/node". I found very little information about this. There are a number of possible way to do it, my choice fell on hook_form_alter().

~~~~
/**
 * Implementation of hook_menu_alter().
 */
function [my_module_name]_menu_alter(&$items) {
  if (module_exists('apachesolr')) {
    // Hide the Content (node/search) tab.
    $items['search/node/%menu_tail']['type'] = MENU_CALLBACK;
  }
}

/**
 * Implementation of hook_form_alter().
 */
function [my_module_name]_form_alter(&$form, $form_state, $form_id) {
  switch ($form_id) {
    case 'search_form':
      if (module_exists('apachesolr') && $form['module']['#value'] == 'node') {
        $form['module']['#value'] = 'apachesolr_search';
      }
      break;
    case 'search_theme_form':
    case 'search_block_form':
      if (module_exists('apachesolr')) {
        $form['#submit'] = array('[my_module_name]_apachesolr_search_form_submit');
      }
      break;
  }
}

/**
 * Process a solr search form submission.
 */
function [my_module_name]_apachesolr_search_form_submit($form, &$form_state) {
  $form_id = $form['form_id']['#value'];
  $form_state['redirect'] = 'search/apachesolr_search/'. trim($form_state['values'][$form_id]);
}
~~~~

Remember to replace [my_module_name] with the name of your module.

With all this done all searches from the search field, the search block and the search page should go to "search/apachesolr_search".

Apache Solr is among the best search function you can have on the web, now you have it on your own site.

The resources I used:

* [Installing and Configuring Solr on Debian GNU/Linux | Omar Abdel-Wahab](http://owahab.com/content/installing-and-configuring-solr-debian-gnulinux)
* [Installing Apache Solr on Drupal 6 | 19th Street Design](http://19thstreetdesign.com/blog/2009.02.04/installing-apache-solr-drupal-6)
* [Setup Drupal 6.x with Apache Solr on Tomcat6 and Ubuntu | Krimson](http://krimson.be/en/setup-drupal6-with-apache-solr-tomcat6-and-ubuntu)
* [Tomcat/UTF-8 - Tomcat Wiki](http://wiki.apache.org/tomcat/Tomcat/UTF-8)

**Update 2009-06-04**:

* Added Instruction to make Tomcat/Solr use UTF-8 encoding so you can search high ASCII characters.
* Added a couple of checks with module_exists('apachesolr').

**Update 2009-11-01**:

* I have upgraded the Tomcat/Solr installation on this server to the latest versions and updated this blog to concur with that.

**Update 2010-01-05**:

* I have upgraded the Solr installation on this server to the stable 1.4 version, added a parameter to Tomcat so connections to it only can be made locally and updated this blog to concur with that.

