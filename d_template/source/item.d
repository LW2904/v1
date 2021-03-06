import std.file : readText;
import std.path : baseName, stripExtension;
import std.json : parseJSON, JSONValue;
import std.string : indexOf;
import std.datetime.date : Date;

struct Item {
	Date date;
	string path;
	string slug;
	string title;
	string content;
}

// Item parseItem(const string itemPath)
// {
// 	immutable content = itemPath.readText;
// 	JSONValue j = content[0 .. indexOf(content, '\n')].parseJSON;

// 	Item i;
// 	i.path = itemPath;
// 	i.title = j["title"].str;
// 	i.slug = itemPath.stripExtension.baseName;
// 	i.date = Date.fromISOExtString(j["date"].str);
// 	i.content = filterMarkdown(content[indexOf(content, '\n') .. $],
// 		MarkdownFlags.backtickCodeBlocks);

// 	return i;
// }